/*
*  用于koa项目简单的验证器, 自动获取request data, 验证类型, 非严格模式下自动调整类型，设置默认值，自定义验证方法等
* */
import validator from 'validator';
import * as _ from 'lodash'
import {Context} from "koa";
import * as util from 'util';

// 目前可以验证的类型
const TYPES = [
    'number',
    'date',
    'string',
    'url',
    'bool',
    'mongoId',
    'object',
    'array',
];

class ValidateError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidateError'
    }
}

export class Validator {
    private args: object;

    constructor(args: object) {
        _(args).each((elem: object) => {
            Validator.validateArgs(elem)
        });
        this.args = args
    }

    private static validateArgs(args) {
        if (TYPES.indexOf(args.type) < 0) {
            throw new ValidateError(`unsupported type: ${args.type}`)
        }
    }

    public validate(ctx: Context) {

        let result: any = {};
        _.toPairs(this.args).forEach(([key, config]) => {
            let datas, data;
            const contexts = config.ctx instanceof Array ? config.ctx : [config.ctx];
            for (let i = 0; i < contexts.length; i++) {
                const context = contexts[i];
                switch (context) {
                    case 'params':
                    case 'headers':
                        datas = ctx[context];
                        break;
                    case 'query':
                    case 'body':
                    case 'fields':
                    case 'header':
                        datas = ctx.request[context];
                        break;
                    default:
                        datas = ctx;
                        break
                }
                data = datas && datas[key];
                if (data !== undefined) {
                    break
                }
            }
            result[key] = this.validateRaw(config, data, key)
        });
        return result
    }

    private validateRaw(config, data, key) {

        const originType = typeof data;
        const originData = data;

        if (data === undefined) {
            if (config.required) {
                throw new ValidateError(`validate failed: argument[${key}] is required`)
            }
            if (typeof config.default === 'function') {
                if (typeof config.default === 'function') {
                    data = config.default()
                } else {
                    data = _.cloneDeep(config.default)
                }
            }
            return data
        }

        if (!config.strict) {
            data = this.preHandle(config, data)
        }

        if (!this.validateType(config, data)) {
            throw new ValidateError(`validate failed: invalid type: argument[${key}] expected[${config.type}] but got[${originType}/${originData}]`)
        }

        if (!this.validateValue(config, data)) {
            let expected = '';
            if (config.min !== undefined) {
                expected += `min:${config.min},`
            }
            if (config.max !== undefined) {
                expected += `max:${config.max},`
            }
            if (config.oneOf !== undefined) {
                expected += `oneOf:${JSON.stringify(config.oneOf)},`
            }
            throw new ValidateError(`validate failed: invalid value: argument[${key}] expected[${expected}] but got[${originType}/${originData}]`)
        }

        if (config.type === 'array') {
            // data.forEach((elem) => this.validateCustom(config, elem))
            if (config.lengthMax !== undefined) {
                config.lengthMax = parseInt(config.lengthMax, 10);
                if (data.length > config.lengthMax) {
                    throw new ValidateError(`validate failed: array length over limit: argument[${key}] expected length max:[${config.lengthMax}] but got length:[${data.length}]`)
                }
            }

            if (config.lengthMin !== undefined) {
                config.lengthMin = parseInt(config.lengthMin, 10);
                if (data.length < config.lengthMin) {
                    throw new ValidateError(`validate failed: array length under limit: argument[${key}] expected length min[${config.lengthMin}] but got length:[${data.length}]`)
                }
            }

            for (let i = 0; i < data.length; i++) {
                data[i] = this.validateCustom(config, data[i])
            }
        } else {
            data = this.validateCustom(config, data)
        }
        return data
    }

    private validateType(config, data) {
        switch (config.type) {
            case 'number':
                return typeof data === 'number' && !isNaN(data);
            case 'string':
                return typeof data === 'string';
            case 'url':
                return typeof data === 'string' && validator.isURL(data, {
                    protocols: ['http', 'https', 'ftp', 'rtsp'],
                });
            case 'date':
                return util.types.isDate(data) && !isNaN(data.valueOf());
            case 'mongoId':
                return typeof data === 'string' && validator.isMongoId(data) ||
                    data !== null && typeof data === 'object' && validator.isMongoId(data.toString());
            case 'bool':
                return typeof data === 'boolean';
            case 'array':
                return Array.isArray(data);
            case 'object':
                return data !== null && typeof data === 'object';
            default:
                return false
        }
    }

    private preHandle(config, data) {
        switch (config.type) {
            case 'number':
                if (typeof data === 'string' && /%/.test(data)) {
                    return Number(data.replace('%', ''))
                }
                return Number(data);
            case 'date':
                if (typeof data === 'string' && /^\d*$/.test(data)) {
                    return new Date(parseInt(data, 10))
                }
                return new Date(data);
            case 'bool':
                if (typeof data === 'boolean')
                    return data;
                if (typeof data === 'string' && (data === 'true' || data === 'false'))
                    return data === 'true';
                if (typeof data === 'string' && (data === 'on' || data === 'off'))
                    return data === 'on';
                if (typeof data === 'number')
                    return !!data;
                return data;
            case 'mongoId':
                return data.toString();
            case 'object':
            case 'array':
                if (typeof data === 'string') {
                    try {
                        return JSON.parse(data)
                    } catch (err) {
                    }
                }
                return data;
            default:
                return data
        }
    }

    private validateValue(config, data) {
        const values = config.values || [];
        return !(config.min && this.preHandle(config, config.min) > data ||
            config.max && this.preHandle(config, config.max) < data ||
            config.oneOf && config.oneOf.map(elem => this.preHandle(config, elem).valueOf()).indexOf(data.valueOf()) < 0);
    }

    private validateCustom(config, data) {
        if (!config.validate) {
            return data
        }
        if (typeof config.validate === 'function') {
            return config.validate(data)
        }
        if (typeof config.validate.validate === 'function') {
            return config.validate.validate(data)
        }
        if (typeof config.validate === 'object') {
            return new Validator(config.validate).validate(data)
        }
        return data
    }
}
