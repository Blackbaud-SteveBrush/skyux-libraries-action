import * as github from '@actions/github';

export function isPullRequest(): boolean {
  return (github.context.eventName === 'pull_request');
}

export function isTag(): boolean {
  return (github.context.ref.indexOf('refs/tags/') === 0);
}

export function isBuild(): boolean {
  return (github.context.ref.indexOf('refs/heads/') === 0);
}

// GitHub only sets GITHUB_HEAD_REF for forked repositories.
// See: https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables
export function isFork(): boolean {
  return (process.env.GITHUB_HEAD_REF !== undefined);
}