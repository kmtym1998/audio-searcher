import path from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

import type { StorybookConfig } from '@storybook/nextjs';
const config: StorybookConfig = {
  stories: ['../app/_components/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal(config) {
    if (!config.resolve) {
      return {};
    }

    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../'),
    ];

    const tsConfigPath = path.resolve(__dirname, '../tsconfig.json');
    console.log('tsConfigPath', tsConfigPath);

    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json'),
      }),
    ];

    return config;
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
