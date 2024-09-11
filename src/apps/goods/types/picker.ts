import { OptionComponentModel } from '../models';
import { OptionComponentsSchema, OptionInfoSchema } from '../schemas';

export interface OptionBubbleSelectedValuesType {
  row: string;
  item: string;
  value: string;
  displayValue: string;
  option?: OptionInfoSchema;
}

export interface PickerInitialValuesProps {
  goodsId: number;
  components: OptionComponentModel[];
  parentOptions?: ParentOptionsProps[];
  selectedOptions?: SelectedOptionsProps[];
  metaData?: Record<string, unknown>;
}

export interface ParentOptionsProps {
  type: OptionComponentsSchema;
  values: string[];
}

export interface SelectedOptionsProps {
  optionId: number;
  stock: number;
}
