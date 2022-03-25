# yas-sequence-diagram
A Yaml-scene extension which generate sequence diagrams from comment line in code

> It's an extension for `yaml-scene`  

## Features:
- Generate to sequence diagram base on comment lines in code
- Auto analystic sequence diagram to exports to a flow diagram which describe components in service, communications between them...

## Details document
> [Wiki Pages](https://github.com/doanthuanthanh88/yas-sequence-diagram/wiki)

## Prerequisite
- Platform [`yaml-scene`](https://www.npmjs.com/package/yaml-scene)


## Installation

```sh
  yas add yas-sequence-diagram        # npm install -g yas-sequence-diagram OR yard global add yas-sequence-diagram
```

## Example
[Examples scenario files](./scenes/test)

1. Create a file `seq_diagram_scene.yaml`
```yaml
  - yas-sequence-diagram:
      commentTag: ///             # Prefix each of line which will be handled to document (optional)
                                  # Default: 
                                  # .js, .ts, .go, .java is ///
                                  # .py, .yaml is #/
                                  # others must be set before run

      includes: ["src"]           # All of files in these path will be scanned (required)

      excludes: []                # All of files in these path will be ignored (optional)
                                  # Default:
                                  # .js, .ts is ['node_modules', 'dist']
                                  # .java is ['bin', 'build']
                                  # .py is ['__pycache__']

      includePattern: ".+\\.ts$"  # Files matched this pattern will be handled (required)

      outDir:  (/tmp/sequence_diagram)   # Output directory which includes sequence diagrams
```

2. Make sure the `ourDir` *`/tmp/sequence_diagram`* is existed

3. Run to generate sequence diagram
```sh
  yas seq_diagram_scene.yaml
```

4. After done, please go to `/tmp/sequence_diagram` to see result. 

> [Output demo](./test/resources/result/README.md)
