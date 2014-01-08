# Sublime Text

No choice, you have to use Sublime Text 3

## [Install](http://www.sublimetext.com/3)

## Install some packages

- [https://sublime.wbond.net/](https://sublime.wbond.net/)
- `cmd + shift + P` (open command palette)
- Type `Install package`
- and install all of these:
    - advanced new file
    - aligntab
    - docblockr
    - ini
    - Jade
    - JsFormat
    - Markdown preview
    - Sidebar Enhancements
    - Stylus
    - Tag
    - TrailingSpaces

*Important* Take some time to read / play about each of them

## User preferences

In the menu `Preferences > Settings - User`, paste:

    {
        "color_scheme": "Packages/Color Scheme - Default/Dawn.tmTheme",
        "detect_indentation": false,
        "default_line_ending": "LF",
        "font_size": 13,
        "ignored_packages":
        [
            "Vintage"
        ],
        "tab_size": 4,
        "translate_tabs_to_spaces": true
    }

In the menu `Preferences > Package Settings > Trailing Spaces > Settings - User`, paste:

    {
        "trailing_spaces_include_current_line" : false,
        "trailing_spaces_trim_on_save": true
    }


## Play with Sublime

- learn all shortcuts [https://gist.github.com/lucasfais/1207002](https://gist.github.com/lucasfais/1207002)
- learn to play with multi selection [http://www.danielmois.com/article/Sublime_Text_2_edit_multiple_selections](http://www.danielmois.com/article/Sublime_Text_2_edit_multiple_selections)
- learn the `cmd+shift+P` > `search query` to have shortcuts for all commands. For instance:
    - `Dupli` > duplicate the currently opened file
    - `Delet` > delete """"
    - `Close al` > close all files
    - `upperc` > uppercase the current selection, same for `lowerc`
    - `tagformat` > format html
    - ... etc.
