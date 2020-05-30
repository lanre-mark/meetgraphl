export function cssTransform(styles, props) {
  return Object.keys(styles).reduce((transformedStyles, rootKey) => {
    const style = styles[rootKey];
    transformedStyles[rootKey] = Object.keys(style).reduce(
      (transaformedStyle, key) => {
        if (typeof style[key] === 'function') {
          transaformedStyle[key] = style[key](props);
        } else {
          transaformedStyle[key] = style[key];
        }
        return transaformedStyle;
      },
      {}
    );
    return transformedStyles;
  }, {});
}
