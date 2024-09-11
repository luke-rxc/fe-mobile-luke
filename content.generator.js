/**
 * 콘텐츠 프리셋 자동생성
 */
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs-extra');

const validate = (answer) => {
  if (!/^[A-Z]+(_[A-Z]+)*$/.test(answer)) {
    return '대문자 Snake Case로 입력 해 주세요';
  }
  return true;
};
const CONTENT_PATH = '/src/apps/content/editorial2';
const COMPONENT_PATH = '/components';
const MODEL_PATH = '/models';
const CONSTANT_PATH = '/constants/presets.ts';
const presetTemplate = (name) => {
  return `
import { forwardRef, useMemo } from 'react';
import styled from 'styled-components';
import type { ${name}DisplayModel, ContentLogInfoModel, PresetComponentModel, PresetRefModel } from '../../../models';
import { useContentStore } from '../../../stores';

const ${name}Component = forwardRef<PresetRefModel, PresetComponentModel>(({ preset, ...props }, ref) => {
  const {
    presetGroup,
    presetType,
    presetId,
    contents,
    goodsList,
    couponList,
    eventList,
    voteList,
    navigationList,
    visible,
    anchor,
  } = preset;
  const displayValues = JSON.parse(contents) as ${name}DisplayModel;

  const contentInfo = useContentStore.use.contentInfo();
  const contentLogInfo: ContentLogInfoModel = useMemo(() => {
    return {
      ...contentInfo,
      presetId,
      presetType,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div ref={ref} {...props}>
      {visible && (
        <${name}Content className="content-wrapper" {...displayValues}>
          ${name} 컴포넌트
        </${name}Content>
      )}
    </div>
  );
});
const ${name} = styled(${name}Component)\`\`;
export default ${name};

const ${name}Content = styled('div').attrs((props: ${name}DisplayModel) => props)\`\`;
`;
};
const presetModelTemplate = (name, presetName) => {
  return `
/**
 * ${presetName} 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type ${name}DisplayModel = {};
`;
};

const question = [
  {
    name: 'presetGroup',
    type: 'input',
    message: 'Enter the presetGroup name(UPPER Snake Case)',
    validate,
  },
  {
    name: 'presetType',
    type: 'input',
    message: 'Enter the presetType name(UPPER Snake Case)',
    validate,
  },
  {
    name: 'presetName',
    type: 'input',
    message: 'Enter the preset name',
  },
];
inquirer
  .prompt(question)
  .then((answer) => {
    const { presetGroup, presetType, presetName } = answer;
    const newDirectoryName = convertSnakeToCamel(presetType);
    const newFileName = convertSnakeToPascal(presetType);
    generateComponent(newDirectoryName, newFileName);
    generateModel(newFileName, presetName);
    updatePreset(presetGroup, presetType);
    updateList(newDirectoryName, newFileName, presetType);
  })
  .catch((error) => {});

async function generateComponent(dir, name) {
  const directory = path.join(process.cwd(), CONTENT_PATH, COMPONENT_PATH, '/presets', dir);
  await generateDirectory(directory);
  await generateFile(path.join(directory, `${name}.tsx`), presetTemplate(name), 'component');
}

async function generateModel(name, presetName) {
  const directory = path.join(process.cwd(), CONTENT_PATH, MODEL_PATH);
  const file = await generateFile(
    path.join(directory, `Preset${name}.ts`),
    presetModelTemplate(name, presetName),
    'model',
  );
  if (file) {
    await updateModel(path.join(directory, 'index.ts'), name);
  }
}

async function generateDirectory(dir) {
  try {
    await fs.ensureDir(dir);
  } catch (err) {
    console.error(err);
  }
}

async function generateFile(path, template, type) {
  try {
    const exists = await fs.pathExists(path);
    if (exists) {
      console.log(`The ${type} file already exists.`);
      return false;
    }

    await fs.writeFile(path, template);
    return true;
  } catch (err) {
    console.error(err);
  }
}

async function updateModel(path, name) {
  try {
    const data = await fs.readFile(path, 'utf8');
    const updatedData = data + `export * from './Preset${name}';\n`;
    let lines = updatedData.split('\n');
    lines.sort((a, b) => a.localeCompare(b));
    await fs.writeFile(path, lines.join('\n') + '\n', 'utf8');
  } catch (err) {
    console.error(err);
  }
}

async function updatePreset(presetGroup, presetType) {
  try {
    const directory = path.join(process.cwd(), CONTENT_PATH, CONSTANT_PATH);
    const data = await fs.readFile(directory, 'utf8');
    const updateValue = updatePresetKey(data, 'PresetGroup', presetGroup);
    const finallyUpdatedValue = updatePresetKey(updateValue, 'PresetType', presetType);
    await fs.writeFile(directory, finallyUpdatedValue, 'utf8');
  } catch (error) {
    console.error('Error modifying the file:', error);
  }
}

async function updateList(dir, fileName, presetType) {
  try {
    const directory = path.join(process.cwd(), CONTENT_PATH, COMPONENT_PATH, 'PresetComponent.tsx');
    const data = await fs.readFile(directory, 'utf8');
    const updatedValue = updateListImport(data, dir, fileName);
    const finallyUpdatedValue = updateListComponent(updatedValue, fileName, presetType);
    await fs.writeFile(directory, finallyUpdatedValue, 'utf8');
  } catch (error) {
    console.error('Error modifying the file:', error);
  }
}

function updateListImport(str, dir, fileName) {
  // preset import문 추출
  const regex = /import\s+[^'"]*\s+from\s+['"]\.\/presets\/[^'"]*['"];/g;
  const currentImports = [...str.matchAll(regex)];
  const newValue = `import ${fileName} from './presets/${dir}/${fileName}';`;
  const existing = currentImports.map((m) => m[0].trim());
  if (existing.includes(newValue.trim())) {
    console.log(`Import "${newValue}" already exists.`);
    return str;
  }

  const allImports = [...existing, newValue].sort();
  const block = `${allImports.join('\n')}\n\n`;
  // 기존 import 교체
  const updatedData = str.replace(regex, 'tempPreset').replace(/(?:tempPreset\s*)+/g, block);
  return updatedData;
}

function updateListComponent(str, fileName, presetType) {
  // 렌더부 추출
  const regex = /\{presetType[^}]*?\s+&&\s+<[^>]*?\s*\/?\s*>}/g;
  const currentRender = [...str.matchAll(regex)];
  const newValue = `{presetType === PresetType.${presetType} && <${fileName} {...props} />}`;
  const existing = currentRender.map((m) => m[0].trim());
  if (existing.includes(newValue.trim())) {
    console.log(`"${newValue}" already exists.`);
    return str;
  }

  const allComponent = [...existing, newValue].sort();
  const block = `${allComponent.join('\n')}\n\n`;
  // 기존 렌더부 교체
  const updatedData = str.replace(regex, 'tempPreset').replace(/(?:tempPreset\s*)+/g, block);
  return updatedData;
}

function updatePresetKey(str, type, keyValue) {
  const newKey = `${keyValue}: '${keyValue}',`;
  const regex =
    type === 'PresetGroup'
      ? /(export\s+const\s+PresetGroup\s*=\s*{)([^}]*)(})(\s+as\s+const;)/
      : /(export\s+const\s+PresetType\s*=\s*{)([^}]*)(})(\s+as\s+const;)/;
  const match = str.match(regex);
  if (match) {
    const currentProperties = match[2]
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // 프로퍼티 체크
    const existingProperty = currentProperties.find((line) => line.startsWith(`${keyValue}:`));
    if (existingProperty) {
      console.log(`${type} Property "${keyValue}" already exists.`);
      return str;
    }
    currentProperties.push(newKey);
    const sortedProperties = currentProperties.sort().join('\n');
    const updatedValue = `${match[1]}\n${sortedProperties}\n${match[3]}${match[4]}`;
    const updatedData = str.replace(regex, `${updatedValue}`);
    return updatedData;
  }
}

function convertSnakeToPascal(snakeStr) {
  return snakeStr
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function convertSnakeToCamel(snakeStr) {
  const words = snakeStr.toLowerCase().split('_');
  return (
    words[0] +
    words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  );
}
