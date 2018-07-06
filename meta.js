module.exports = {
  prompts: {
    name: {
      type: 'string',
      required: true,
      message: '项目名称'
    },
    appid: {
      type: 'string',
      required: true,
      message: 'AppId',
      default: ''
    },
    description: {
      type: 'string',
      required: false,
      message: '项目介绍',
      default: 'A WePY project'
    },
    author: {
      type: 'string',
      message: '作者'
    },
    web: {
      type: 'confirm',
      message: 'Use web transform feature in your project?'
    }
  },
  filters: {
    '.eslintignore': 'lint',
    '.eslintrc.js': 'lint',
    'src/index.template.html': 'web',
    'src/store/**/*': 'redux'
  }
}
