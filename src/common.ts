/*
 * @Date: 2020-10-07 14:50:03
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-07 15:08:33
 */
import { Config } from './types';
import TOML from '@iarna/toml';
import { promises as fs } from 'fs';

const globalConfig = {} as Config;

async function initGlobalConfig() {
    const text = await fs.readFile('./config.toml', 'utf-8');
    const cf = TOML.parse(text);
    Object.assign(globalConfig, cf);
}

export { globalConfig, initGlobalConfig };
