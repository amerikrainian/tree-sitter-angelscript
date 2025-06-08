import XCTest
import SwiftTreeSitter
import TreeSitterAngelscript

final class TreeSitterAngelscriptTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_angelscript())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Angelscript grammar")
    }
}
