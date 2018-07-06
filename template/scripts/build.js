/**
 * @fileOverview 构建配置，增强 wepy
 * @author houquan | houquan@babytree-inc.com
 * @version 1.0.0 | 2018-05-10       // 初始版本
*/

import path from 'path'
import fs from 'fs'
import yamlLoader from 'js-yaml'

const env = process.env.NODE_ENV || 'development'

const root = path.join(__dirname, '..')
const configPath = path.join(root, 'config/app.yaml')
const config = yamlLoader.safeLoad(fs.readFileSync(configPath))
const { dev, test, prod, pre, ...commonConfig } = config || {}

const date = new Date()
const year = date.getFullYear()
const month = date.getMonth() + 1
const day = date.getDay()

const headerComment = `/**
 * MUST NOT MODIFY THE FILE!!!!!!
 * @fileOverview 构建生成的配置文件，切勿自动修改，若有需求，请修改 /config/app.yaml 中的配置
 * @author houquan | houquan@babytree-inc.com
 * @version 1.0.0 | ${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}
*/
`
const targetConfig = config[env] || {}
const tcPath = path.join(root, 'src/config')
const targetPath = path.join(tcPath, 'index.js')
try {
  fs.accessSync(tcPath)
}catch(err){
  fs.mkdirSync(tcPath)
}
const targetSteam = fs.createWriteStream(targetPath)
targetSteam.write(headerComment)

const code = `
const config = ${JSON.stringify({
  ...commonConfig,
  ...targetConfig
  }, null, '  ')}

export default config
`

targetSteam.end(code)

targetSteam.on('close', () => {
  console.log('build config file success!')
})
