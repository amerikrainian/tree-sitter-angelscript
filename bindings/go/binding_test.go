package tree_sitter_angelscript_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_angelscript "github.com/amerikrainian/tree-sitter-angelscript/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_angelscript.Language())
	if language == nil {
		t.Errorf("Error loading Angelscript grammar")
	}
}
