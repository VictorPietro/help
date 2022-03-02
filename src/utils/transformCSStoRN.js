import postcss from "postcss";
import postcssJs from "postcss-js";
import transform from 'css-to-react-native';

const toJSSObject = (cssText) => {
    const root = postcss.parse(cssText);
    return postcssJs.objectify(root);
};

export const toJSS = (cssText) => {
    try {
        return JSON.stringify(toJSSObject(cssText), null, 2);
    } catch (e) {
        return "Error translating CSS to JSS";
    }
};

export const toRN = (cssText) => {
    try {

        if (cssText.length < 1 || !cssText) {
            return {};
        }

        const output = toJSSObject(cssText);
        const result = Object.keys(output).map((rules) => [rules, output[rules]]);

        const stringfiedResult = JSON.stringify(transform(result), null, 2);
        const objectResult = JSON.parse(stringfiedResult);

        return objectResult;
    } catch (e) {
        return {};
    }
};