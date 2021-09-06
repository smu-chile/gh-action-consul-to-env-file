# Ansible Prerequisites

This Action allows you to create the files need for the ansible run

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
    basepath: "polymathes/infrastructure/terraform-aws-eks-frontend"
jobs:
  BuildClusterAnsible:
    - name: Checkout ansible prerequisites action repo
      uses: actions/checkout@v2
      with:
        repository: 'smu-chile/gh-action-consul-to-env-file'
        ref: 'master'
        token: ${{ secrets.ACTION_PAT }} 
        path: ./.github/actions/gh-action-consul-to-env-file
        
    - name: Create filenames
      uses: ./.github/actions/gh-action-consul-to-env-file
      with:
        consul_address: "consul.smu-labs.cl"
        consul_token: ${{ secrets.CONSUL_HTTP_TOKEN }}
        base_path: "${{ env.basepath }}/${{needs.ConfigureVars.outputs.environment}}"
        excluded_keys: 'terraform-state,id-rsa,id-rsa-pub,sealed-secret-key,sealed-secret-certificate,ssh-deploy-public-key,ssh-deploy-private-key,config-map-aws-auth,kubeconfig,public-key,external-dns-deployment,private-subnets,public-subnets'
        consul_port: 443
        consul_use_ssl: true
        env_filename: ".env_file" 
```
