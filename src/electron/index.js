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

module.exports = {

  unzip:function ([[fileName, outputDirectory]]) {
    return unzip(fileName, outputDirectory);
  }

};
async function unzip(fileName, outputDirectory) {

  if (!fs.existsSync(outputDirectory)){
    console.log(outputDirectory);
    await fs.promises.mkdir(outputDirectory,{recursive:true})
  }
  const zip = new StreamZip.async({ file: fileName });
  const count = await zip.extract(null, outputDirectory);
  await zip.close();

 return {
    loaded: undefined,
    total: count
  }


}
