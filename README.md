# yas-sequence-diagram
A Yaml-scene extension which generate sequence diagrams from comment line in code

# Prerequisite
Must install `yaml-scene`

```sh
  # Install via yarn
  yarn global add yaml-scene

  # Or install via npm
  npm install -g yaml-scene
```

# How to use

1. Install the extension
```sh
  # Install via yarn
  yarn global add yas-sequence-diagram

  # Or install via npm
  npm install -g yas-sequence-diagram
```
3. Create a file `seq_diagram_scene.yaml`
```yaml
  - yas-sequence-diagram~SequenceDiagram:
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

      outDir: /tmp/sequence_diagram   # Output directory which includes sequence diagrams
```

4. Make a new output directory
```sh
  mkdir /tmp/sequence_diagram
```

5. Run to generate sequence diagram
```sh
  yas seq_diagram_scene.yaml
```

6. After done, please go to `/sequence_diagram` to see result

# Guide

Please go to [here](./GUIDE.md) for details