/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */


const StreamZip = require('node-stream-zip');
const fs = require('fs');
let mainWindow = require('electron').BrowserWindow.getAllWindows()[0]

let closeMainWindow = async (e)=>{
  mainWindow=undefined;
};

mainWindow.once("close" ,closeMainWindow)
module.exports = {

  unzip:function ([[fileName, outputDirectory,progressCallbackName]]) {
    return unzip(fileName, outputDirectory,progressCallbackName);
  }

};
async function unzip(fileName, outputDirectory,progressCallbackName) {
  return new Promise(async (reslove , reject)=>{
    try {
      if (!fs.existsSync(outputDirectory)){
        //console.log(outputDirectory);
        await fs.promises.mkdir(outputDirectory,{recursive:true})
      }
      let boolSendJsFeedbackEvery250ms=false
      const zip = new StreamZip.async({ file: fileName });
      zip.on('error', err => { reject(error)});
      zip.on('extract', (entry, file) => {
        counter++;
        if(boolSendJsFeedbackEvery250ms)
          return;
        boolSendJsFeedbackEvery250ms=true;
        setTimeout(()=>{boolSendJsFeedbackEvery250ms=false;},250);

        mainWindow?.webContents?.executeJavaScript(`if(window.${progressCallbackName})${progressCallbackName}({loaded:${counter},total:${entriesCount}})`).catch((e)=>{
          // console.error("mainWindow.webContents.executeJavaScript[Zip]")
          // console.error(e)
        })
      });
      const entries = await zip.entries();
      const entriesCount = Object.values(entries).filter((etr)=>!etr.isDirectory).length;
      let counter=0

      await zip.extract(null, outputDirectory);
    
    
      await zip.close();
    
      return reslove( {
            loaded: undefined,
            total: entriesCount
          })
  
    
      
    } catch (error) {
      reject(error)
    }

  })
  

}
