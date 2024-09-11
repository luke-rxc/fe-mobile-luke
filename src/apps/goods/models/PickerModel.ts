import { LayoutOptionsSchema } from '../schemas';

export const toLayoutOptionsModel = (layoutOptions: LayoutOptionsSchema) => {
  const { layouts } = layoutOptions;

  const layoutsModel = layouts.map((layout) => {
    const { items } = layout;
    const itemsModel = items.map((item) => {
      return {
        ...item,
        value: item.value.slice(0, 10),
      };
    });

    return {
      ...layout,
      items: itemsModel,
    };
  });

  return {
    ...layoutOptions,
    layouts: layoutsModel,
  };
};
