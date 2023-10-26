# Github action, reads KV from consul and write envfile, to be imported with source command

This Action allows you to create the files need for the ansible run

## File example
```
export FOO='BAR'
```
## Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `env_filename` | `string` | `.env_file` | Filename of environmental variables file |
| `consul_use_ssl` | `boolean` | `true` | Use HTTPS for connecting to consul |
| `consul_port` | `string` | `443` | TCP port to use when connecting to consul |
| `excluded_keys` | `string` | `` | List of keys not needed to export    |
| `base_path` | `string` | `` |  Path in consul for getting the input for ansible|
| `consul_token` | `string` | `` | Consul security token |
| `consul_address` | `string` | | URL Consul |

## Usage
```yaml
name: Ansible usage
env:
    basepath: "base-path/example"
jobs:
  BuildClusterAnsible:
    - name: Create filenames
      uses: smu-chile/gh-action-consul-to-env-file@v1.0.2
      with:
        consul_address: ""
        consul_token: ${{ secrets.CONSUL_HTTP_TOKEN }}
        base_path: "${{ env.basepath }}/${{needs.ConfigureVars.outputs.environment}}"
        excluded_keys: 'excluded-example'
        consul_port: 443
        consul_use_ssl: true
        env_filename: ".env_file" 
```
