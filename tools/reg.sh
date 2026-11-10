#!/bin/bash
# usage: tools/reg.sh h1-a  → content/index.js, sw.js 에 등록 (이미 있으면 건너뜀)
n=$1; v=$(echo $n | tr -d '-')
grep -q "import $v from" content/index.js || sed -i "s#^import m3b from './m3-b.js';#&\nimport $v from './$n.js';#" content/index.js
grep -q "\.\.\.$v\]" content/index.js || sed -i "s#\.\.\.m3b\(.*\)\]#...m3b\1, ...$v]#" content/index.js
grep -q "content/$n.js" sw.js || sed -i "s#'content/m3-b.js'#'content/m3-b.js', 'content/$n.js'#" sw.js
