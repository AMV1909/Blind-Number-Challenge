set -e
npm run build
cd dist
echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m 'deploy'

git push -f git@github.com:AMV1909/Blind-Number-Challenge.git master:gh-pages

cd -