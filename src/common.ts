/*
 * @Date: 2020-10-07 14:50:03
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-07 16:15:59
 */
import { Config } from './types';
import TOML from '@iarna/toml';
import { readFileSync } from 'fs';


const globalConfig = {} as Config;
Object.assign(globalConfig, TOML.parse(readFileSync('./config.toml', 'utf-8')));

export { globalConfig };
