const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
  const release_id = core.getInput('release_id')

  const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
  const { owner, repo } = github.context.repo

  await octokit.rest.repos.updateRelease({ owner, repo, release_id, draft: false })
  console.log(`Published release with id ${release_id}`)
}

async function run() {
  try {
    await main()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
