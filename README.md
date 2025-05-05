# Math 24 Test 

## Description
This is a backend for Math 24 Test using Typescript, Express, and Node.js, implementing with MySQL Database. 

ER-Diagram: https://drive.google.com/file/d/1O717qv1TvmeJlpiZLc2PZx6Wrm-1O2HO/view?usp=sharing

## Services
| Path | Method | Authen | params | query | body |  
|:--|:--|:--|:--|:--  |:--
USER-Auth 
|/api/register |post|-|-|-| {email,firstname,lastname,password,confirmPassword}
|/api/login|post|-|-|-| {email,password}
|/api/me|get|y|-|-|-|
USER-Game
|/api/game/generate-numbers|get|y|-|-|-|
|/api/game/submit-solution|post|y|-|-|{gameId,expression}|
USER-History
|/api/history/all|get|y|-|-|-|
|/api/history/:id|get|y|id|-|-|
USER-CHEAT