# publish-release

A GitHub Action to publish a draft release.

[actions/create-release](https://github.com/actions/create-release) can create a *draft* release,
and then [actions/upload-release-asset](https://github.com/actions/upload-release-asset)
can upload builds and finally this action can publish the release.

This has the advantage that the latest release link (https://github.com/owner/repo/releases/latest)
always points to a fully-built release.

Note that the release must *not be marked as prerelease* for this to work.

This also means it's possible to have a stable URL for a release asset which always has the same filename:
https://github.com/owner/repo/releases/latest/download/asset-filename.tar.gz

Those URLs are documented in [GitHub Help](https://help.github.com/en/github/administering-a-repository/linking-to-releases#linking-to-the-latest-release).

Minimal example workflow:

```yaml
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
    - name: Create Draft Release
      id: create_release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: <tofill>
        release_name: <tofill>
        draft: true
        prerelease: false

    - uses: actions/upload-release-asset@v1.0.1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        upload_url: ${{ steps.create_release.outputs.upload_url }}
        asset_path: ./my-artifact.zip
        asset_name: my-artifact.zip
        asset_content_type: application/zip

    - uses: eregon/publish-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        release_id: ${{ steps.create_release.outputs.id }}

```

A complete workflow building on multiple platforms using this approach can be seen
[here](https://github.com/ruby/ruby-dev-builder/blob/master/.github/workflows/build.yml).
