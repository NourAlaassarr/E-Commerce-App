import express  from "express"
import {InitiateApp} from './src/utils/initiateApp.js'
import { config } from "dotenv"
import path from 'path'
config({ path: path.resolve('./config/config.env') })

const App = express()
InitiateApp(App,express)