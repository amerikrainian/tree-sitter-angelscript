/**
 * @file Parser for Angelscript
 * @author Amerikrainian <olegjpittman@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  PAREN_DECLARATOR: -10,
  ASSIGNMENT: -2,
  CONDITIONAL: -1,
  DEFAULT: 0,
  LOGICAL_OR: 1,
  LOGICAL_XOR: 2,
  LOGICAL_AND: 3,
  INCLUSIVE_OR: 4,
  EXCLUSIVE_OR: 5,
  BITWISE_AND: 6,
  EQUAL: 7,
  RELATIONAL: 8,
  SHIFT: 9,
  ADD: 10,
  MULTIPLY: 11,
  POWER: 12,
  CAST: 13,
  UNARY: 14,
  CALL: 15,
  FIELD: 16,
  SUBSCRIPT: 17,
};

module.exports = grammar({
  name: "angelscript",

  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [
    [$.qualified_type_identifier, $.qualified_identifier],
    [$.type_specifier, $.qualified_type_identifier],
    [$.type_specifier, $.qualified_identifier, $.qualified_type_identifier],
    [$.type_specifier, $.qualified_identifier, $.qualified_type_identifier],
    [$.type_qualifier, $.class_attributes],
    [$._top_level_item, $.type_specifier],
    [$.qualified_type_identifier],
    [$.compound_statement, $.initializer_list],
    [$.primary_expression, $.initializer_list],
    [$.enum_specifier],
    [$.template_function, $.qualified_identifier],
    [$.type_specifier, $.qualified_type_identifier, $.constructor_definition],
    [$.comma_expression, $.initializer_list],
    [$._init_declarator, $.primary_expression],
    [$.parameter_list, $.argument_list],
    [$.primitive_type, $.parameter_list],
    [$.attribute_specifier, $.attribute_declaration],
    [$._declarator, $.function_definition],
    [
      $.function_definition,
      $.class_attributes,
      $.interface_definition,
      $.enum_specifier,
      $.funcdef_declaration,
    ],
    [$.type_specifier, $.qualified_type_identifier, $.lambda_parameter],
    [$.type_specifier, $.qualified_type_identifier, $.primary_expression],
    [$.template_function, $.primary_expression],
  ],

  inline: ($) => [
    $._type_identifier,
    $._expression_not_binary,
    $._assignment_left_expression,
    $._field_identifier,
    $._namespace_identifier,
  ],

  supertypes: ($) => [
    $.expression,
    $.statement,
    $.type_specifier,
    $._declarator,
  ],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._top_level_item),

    _top_level_item: ($) =>
      choice(
        prec.dynamic(1, $.declaration),
        $.function_definition,
        $._top_level_statement,
        $.attributed_statement,
        $.class_definition,
        $.interface_definition,
        $.mixin_definition,
        $.enum_specifier,
        $.typedef_declaration,
        $.funcdef_declaration,
        $.namespace_definition,
        $.using_declaration,
        $.import_declaration,
        $.virtual_property_declaration
      ),

    _block_item: ($) =>
      choice(
        prec.dynamic(1, $.declaration),
        $.statement,
        $.attributed_statement,
        $.using_declaration
      ),

    comment: (_) =>
      token(
        choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"))
      ),

    if_keyword: (_) => "if",
    else_keyword: (_) => "else",
    switch_keyword: (_) => "switch",
    case_keyword: (_) => "case",
    default_keyword: (_) => "default",
    while_keyword: (_) => "while",
    do_keyword: (_) => "do",
    for_keyword: (_) => "for",
    foreach_keyword: (_) => "foreach",
    return_keyword: (_) => "return",
    break_keyword: (_) => "break",
    continue_keyword: (_) => "continue",
    try_keyword: (_) => "try",
    catch_keyword: (_) => "catch",
    class_keyword: (_) => "class",
    interface_keyword: (_) => "interface",
    mixin_keyword: (_) => "mixin",
    enum_keyword: (_) => "enum",
    namespace_keyword: (_) => "namespace",
    typedef_keyword: (_) => "typedef",
    funcdef_keyword: (_) => "funcdef",
    using_keyword: (_) => "using",
    import_keyword: (_) => "import",

    void_keyword: (_) => "void",
    bool_keyword: (_) => "bool",
    int_keyword: (_) => "int",
    int8_keyword: (_) => "int8",
    int16_keyword: (_) => "int16",
    int32_keyword: (_) => "int32",
    int64_keyword: (_) => "int64",
    uint_keyword: (_) => "uint",
    uint8_keyword: (_) => "uint8",
    uint16_keyword: (_) => "uint16",
    uint32_keyword: (_) => "uint32",
    uint64_keyword: (_) => "uint64",
    float_keyword: (_) => "float",
    double_keyword: (_) => "double",
    auto_keyword: (_) => "auto",

    const_keyword: (_) => "const",
    final_keyword: (_) => "final",
    override_keyword: (_) => "override",
    explicit_keyword: (_) => "explicit",
    property_keyword: (_) => "property",
    abstract_keyword: (_) => "abstract",
    private_keyword: (_) => "private",
    protected_keyword: (_) => "protected",
    shared_keyword: (_) => "shared",
    external_keyword: (_) => "external",
    get_keyword: (_) => "get",
    set_keyword: (_) => "set",
    delete_keyword: (_) => "delete",

    true_keyword: (_) => "true",
    false_keyword: (_) => "false",
    null_keyword: (_) => "null",

    scope_resolution: (_) => "::",
    is_operator: (_) => "is",
    not_is_operator: (_) => "!is",
    and_operator: (_) => "and",
    or_operator: (_) => "or",
    xor_operator: (_) => "xor",
    cast_keyword: (_) => "cast",
    function_keyword: (_) => "function",
    reference_operator: (_) => "&",
    // Seen with refs
    in_keyword: (_) => "in",
    out_keyword: (_) => "out",
    in_out_keyword: (_) => "inout",

    plus_op: (_) => token("+"),
    sub_op: (_) => token("-"),
    mul_op: (_) => token("*"),
    div_op: (_) => token("/"),
    mod_op: (_) => token("%"),
    exp_op: (_) => token("**"),

    not_op: (_) => token("!"),
    bitnot_op: (_) => token("~"),
    inc_op: (_) => token("++"),
    dec_op: (_) => token("--"),

    lt_op: (_) => token("<"),
    lte_op: (_) => token("<="),
    gt_op: (_) => token(">"),
    gte_op: (_) => token(">="),
    eq_op: (_) => token("=="),
    neq_op: (_) => token("!="),

    andand_op: (_) => token("&&"),
    oror_op: (_) => token("||"),
    xorxor_op: (_) => token("^^"),

    bitand_op: (_) => token("&"),
    bitor_op: (_) => token("|"),
    bitxor_op: (_) => token("^"),
    lsl_op: (_) => token("<<"),
    lsr_op: (_) => token(">>"),
    asr_op: (_) => token(">>>"),

    equal_op: (_) => token("="),
    plus_equal_op: (_) => token("+="),
    sub_equal_op: (_) => token("-="),
    mul_equal_op: (_) => token("*="),
    div_equal_op: (_) => token("/="),
    mod_equal_op: (_) => token("%="),
    exp_equal_op: (_) => token("**="),
    bitand_equal_op: (_) => token("&="),
    bitor_equal_op: (_) => token("|="),
    bitxor_equal_op: (_) => token("^="),
    lsl_equal_op: (_) => token("<<="),
    lsr_equal_op: (_) => token(">>="),
    asr_equal_op: (_) => token(">>>="),

    identifier: (_) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    _type_identifier: ($) => alias($.identifier, $.type_identifier),
    _field_identifier: ($) => alias($.identifier, $.field_identifier),
    _namespace_identifier: ($) => alias($.identifier, $.namespace_identifier),

    number_literal: (_) => {
      return token(
        choice(
          // Based numbers (no suffixes allowed)
          /0[xX][0-9a-fA-F]+/,
          /0[bB][01]+/,
          /0[oO][0-7]+/,
          /0[dD][0-9]+/,

          // Floating point patterns (with optional 'f'/'F' suffix)

          // Pattern: digits.digits[exponent][f]
          seq(
            /[0-9]+/,
            ".",
            /[0-9]+/,
            optional(seq(/[eE]/, optional(/[+-]/), /[0-9]+/)),
            optional(/[fF]/)
          ),

          // Pattern: digits.[exponent][f]
          seq(
            /[0-9]+/,
            ".",
            optional(seq(/[eE]/, optional(/[+-]/), /[0-9]+/)),
            optional(/[fF]/)
          ),

          // Pattern: .digits[exponent][f]
          seq(
            ".",
            /[0-9]+/,
            optional(seq(/[eE]/, optional(/[+-]/), /[0-9]+/)),
            optional(/[fF]/)
          ),

          // Pattern: digits exponent [f] (no decimal point)
          seq(/[0-9]+/, /[eE]/, optional(/[+-]/), /[0-9]+/, optional(/[fF]/)),

          // Plain integers (no suffixes)
          /[0-9]+/
        )
      );
    },

    string_literal: (_) =>
      token(
        choice(
          seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),
          seq("'", repeat(choice(/[^'\\]/, /\\./)), "'"),
          /"""[\s\S]*?"""/ // Multiline string
        )
      ),

    boolean_literal: ($) => choice($.true_keyword, $.false_keyword),

    null_literal: ($) => $.null_keyword,

    declaration: ($) =>
      seq(
        optional($.access_specifier),
        field("type", $.type_descriptor),
        commaSep1(
          field("declarator", choice($._init_declarator, $._declarator))
        ),
        ";"
      ),

    _init_declarator: ($) =>
      choice(
        seq(
          field("declarator", $._declarator),
          "=",
          field("value", choice($.initializer_list, $.expression))
        ),
        seq(
          field("declarator", $._declarator),
          field("arguments", $.argument_list)
        )
      ),

    _declarator: ($) =>
      choice(
        $.attributed_declarator,
        $.reference_declarator,
        $.function_declarator,
        $.array_declarator,
        $.parenthesized_declarator,
        $.identifier,
        $.qualified_identifier,
        $.template_function
      ),

    parenthesized_declarator: ($) =>
      prec.dynamic(PREC.PAREN_DECLARATOR, seq("(", $._declarator, ")")),

    attributed_declarator: ($) =>
      prec.right(seq($._declarator, repeat1($.attribute_declaration))),

    reference_declarator: ($) =>
      prec.dynamic(
        1,
        prec.right(
          seq(
            $.reference_operator,
            optional(choice($.in_keyword, $.out_keyword, $.in_out_keyword)),
            field("declarator", $._declarator)
          )
        )
      ),

    array_declarator: ($) =>
      prec.right(
        1,
        seq(
          field("declarator", $._declarator),
          "[",
          field("size", optional($.expression)),
          "]"
        )
      ),

    function_declarator: ($) =>
      prec.right(
        1,
        seq(
          field("declarator", $._declarator),
          field("parameters", $.parameter_list),
          optional($.const_keyword),
          repeat($.function_attribute)
        )
      ),

    type_specifier: ($) =>
      choice(
        $.enum_specifier,
        $.primitive_type,
        $.template_type,
        $.auto_type,
        $.qualified_type_identifier,
        $._type_identifier,
        $.wildcard_type
      ),

    primitive_type: ($) =>
      choice(
        $.void_keyword,
        $.bool_keyword,
        $.int_keyword,
        $.int8_keyword,
        $.int16_keyword,
        $.int32_keyword,
        $.int64_keyword,
        $.uint_keyword,
        $.uint8_keyword,
        $.uint16_keyword,
        $.uint32_keyword,
        $.uint64_keyword,
        $.float_keyword,
        $.double_keyword
      ),

    auto_type: ($) => $.auto_keyword,

    wildcard_type: (_) => "?",

    type_qualifier: ($) =>
      choice(
        $.const_keyword,
        $.final_keyword,
        $.override_keyword,
        $.explicit_keyword,
        $.property_keyword,
        $.abstract_keyword
      ),

    access_specifier: ($) => choice($.private_keyword, $.protected_keyword),

    type_descriptor: ($) =>
      seq(
        optional($.const_keyword),
        field("type", $.type_specifier),
        repeat(choice($.array_suffix, $.handle_suffix))
      ),

    array_suffix: (_) => seq("[", "]"),

    handle_suffix: ($) => seq("@", optional($.const_keyword)),

    template_type: ($) =>
      prec(
        1,
        seq(
          field("name", $._type_identifier),
          field("arguments", $.template_argument_list)
        )
      ),

    template_function: ($) =>
      seq(
        field("name", $.identifier),
        field("arguments", $.template_argument_list)
      ),

    template_method: ($) =>
      seq(
        field("name", $.identifier),
        field("arguments", $.template_argument_list)
      ),

    template_argument_list: ($) =>
      seq("<", commaSep1($.type_descriptor), alias(token(prec(1, ">")), ">")),

    qualified_identifier: ($) =>
      choice(
        // Global scope: ::identifier
        seq($.scope_resolution, choice($.identifier, $.template_function)),
        // Nested scope: a::b::c
        seq(
          choice($.identifier, $.template_function),
          repeat1(
            seq($.scope_resolution, choice($.identifier, $.template_function))
          )
        )
      ),

    qualified_type_identifier: ($) =>
      seq(
        optional($.scope_resolution),
        sep1(choice($._type_identifier, $.template_type), $.scope_resolution)
      ),

    parameter_list: ($) =>
      seq(
        "(",
        optional(
          choice(
            $.void_keyword,
            commaSep(choice($.parameter_declaration, $.variadic_parameter))
          )
        ),
        ")"
      ),

    parameter_declaration: ($) =>
      seq(
        field("type", $.type_descriptor),
        optional(
          field("declarator", choice($.reference_declarator, $.identifier))
        ),
        optional(seq("=", field("default_value", $.expression)))
      ),

    variadic_parameter: (_) => "...",

    function_definition: ($) =>
      seq(
        optional($.attribute_specifier),
        repeat($._shared_external),
        optional($.access_specifier),
        field("return_type", $.type_descriptor),
        optional($.reference_operator),
        field("declarator", $.function_declarator),
        choice(
          field("body", $.compound_statement),
          seq("=", $.delete_keyword, ";"),
          ";"
        )
      ),

    function_attribute: ($) =>
      choice(
        $.final_keyword,
        $.override_keyword,
        $.delete_keyword,
        $.explicit_keyword,
        $.property_keyword
      ),

    class_definition: ($) =>
      seq(
        repeat($.class_attributes),
        $.class_keyword,
        field("name", $._type_identifier),
        choice(
          seq(optional($.base_class_clause), field("body", $.class_body)),
          ";"
        )
      ),

    class_attributes: ($) =>
      choice($._shared_external, $.abstract_keyword, $.final_keyword),

    _shared_external: ($) => choice($.shared_keyword, $.external_keyword),

    base_class_clause: ($) => seq(":", commaSep1($.qualified_type_identifier)),

    class_body: ($) =>
      seq(
        "{",
        repeat(
          choice(
            $.function_definition,
            $.constructor_definition,
            $.destructor_definition,
            $.declaration,
            $.virtual_property_declaration,
            $.funcdef_declaration,
            ";"
          )
        ),
        "}"
      ),

    constructor_definition: ($) =>
      seq(
        optional($.access_specifier),
        field("name", $.identifier),
        field("parameters", $.parameter_list),
        repeat($.function_attribute),
        choice(
          field("body", $.compound_statement),
          seq("=", choice("default", $.delete_keyword), ";"),
          ";"
        )
      ),

    destructor_definition: ($) =>
      seq(
        optional($.access_specifier),
        "~",
        field("name", $.identifier),
        field("parameters", $.parameter_list),
        repeat($.function_attribute),
        choice(field("body", $.compound_statement), ";")
      ),

    interface_definition: ($) =>
      seq(
        repeat($._shared_external),
        $.interface_keyword,
        field("name", $._type_identifier),
        choice(
          seq(optional($.base_class_clause), field("body", $.interface_body)),
          ";"
        )
      ),

    interface_body: ($) =>
      seq(
        "{",
        repeat(choice($.interface_method, $.virtual_property_declaration, ";")),
        "}"
      ),

    interface_method: ($) =>
      seq(
        field("return_type", $.type_descriptor),
        optional($.reference_operator),
        field("name", $.identifier),
        field("parameters", $.parameter_list),
        optional($.const_keyword),
        ";"
      ),

    mixin_definition: ($) => seq($.mixin_keyword, $.class_definition),

    virtual_property_declaration: ($) =>
      seq(
        optional($.access_specifier),
        field("type", $.type_descriptor),
        optional($.reference_operator),
        field("name", $.identifier),
        "{",
        repeat1($.accessor_declaration),
        "}"
      ),

    accessor_declaration: ($) =>
      seq(
        field("kind", choice($.get_keyword, $.set_keyword)),
        optional($.const_keyword),
        repeat($.function_attribute),
        choice($.compound_statement, ";")
      ),

    enum_specifier: ($) =>
      seq(
        repeat($._shared_external),
        $.enum_keyword,
        field("name", $._type_identifier),
        choice(field("body", $.enumerator_list), ";")
      ),

    enumerator_list: ($) =>
      seq("{", commaSep($.enumerator), optional(","), "}"),

    enumerator: ($) =>
      seq(
        field("name", $.identifier),
        optional(seq("=", field("value", $.expression)))
      ),

    typedef_declaration: ($) =>
      seq(
        $.typedef_keyword,
        field("type", $.primitive_type),
        field("name", $._type_identifier),
        ";"
      ),

    funcdef_declaration: ($) =>
      seq(
        repeat($._shared_external),
        $.funcdef_keyword,
        field("return_type", $.type_descriptor),
        optional($.reference_operator),
        field("name", $._type_identifier),
        field("parameters", $.parameter_list),
        ";"
      ),

    namespace_definition: ($) =>
      seq(
        $.namespace_keyword,
        field("name", sep1($._namespace_identifier, $.scope_resolution)),
        "{",
        repeat($._top_level_item),
        "}"
      ),

    using_declaration: ($) =>
      seq(
        $.using_keyword,
        choice(
          seq(
            $.namespace_keyword,
            sep1($._namespace_identifier, $.scope_resolution)
          ),
          $.qualified_type_identifier
        ),
        ";"
      ),

    import_declaration: ($) =>
      seq(
        $.import_keyword,
        field("return_type", $.type_descriptor),
        optional($.reference_operator),
        field("name", $.identifier),
        field("parameters", $.parameter_list),
        optional($.const_keyword),
        repeat($.function_attribute),
        "from",
        field("module", $.string_literal),
        ";"
      ),

    statement: ($) =>
      choice(
        $.labeled_statement,
        $.compound_statement,
        $.expression_statement,
        $.if_statement,
        $.switch_statement,
        $.while_statement,
        $.do_while_statement,
        $.for_statement,
        $.foreach_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $.try_statement
      ),

    _top_level_statement: ($) =>
      choice(
        $.labeled_statement,
        $.compound_statement,
        alias($._top_level_expression_statement, $.expression_statement),
        $.if_statement,
        $.switch_statement,
        $.while_statement,
        $.do_while_statement,
        $.for_statement,
        $.foreach_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $.try_statement
      ),

    labeled_statement: ($) =>
      seq(field("label", $.identifier), ":", $.statement),

    compound_statement: ($) => seq("{", repeat($._block_item), "}"),

    expression_statement: ($) =>
      seq(optional(choice($.expression, $.comma_expression)), ";"),

    _top_level_expression_statement: ($) =>
      seq(optional($._expression_not_binary), ";"),

    if_statement: ($) =>
      prec.right(
        seq(
          $.if_keyword,
          "(",
          field("condition", $.expression),
          ")",
          field("consequence", $.statement),
          optional(seq($.else_keyword, field("alternative", $.statement)))
        )
      ),

    switch_statement: ($) =>
      seq(
        $.switch_keyword,
        "(",
        field("value", $.expression),
        ")",
        field("body", $.switch_body)
      ),

    switch_body: ($) => seq("{", repeat($.case_statement), "}"),

    case_statement: ($) =>
      seq(
        choice(
          seq($.case_keyword, field("value", $.expression)),
          $.default_keyword
        ),
        ":",
        repeat($.statement)
      ),

    while_statement: ($) =>
      seq(
        $.while_keyword,
        "(",
        field("condition", $.expression),
        ")",
        field("body", $.statement)
      ),

    do_while_statement: ($) =>
      seq(
        $.do_keyword,
        field("body", $.statement),
        $.while_keyword,
        "(",
        field("condition", $.expression),
        ")",
        ";"
      ),

    for_statement: ($) =>
      seq(
        $.for_keyword,
        "(",
        choice(
          field("initializer", $.declaration),
          seq(field("initializer", optional($.expression)), ";")
        ),
        field("condition", optional($.expression)),
        ";",
        field("update", commaSep($.expression)),
        ")",
        field("body", $.statement)
      ),

    foreach_statement: ($) =>
      seq(
        $.foreach_keyword,
        "(",
        commaSep1(
          seq(field("type", $.type_descriptor), field("name", $.identifier))
        ),
        ":",
        field("range", $.expression),
        ")",
        field("body", $.statement)
      ),

    return_statement: ($) => seq($.return_keyword, optional($.expression), ";"),

    break_statement: ($) => seq($.break_keyword, ";"),

    continue_statement: ($) => seq($.continue_keyword, ";"),

    try_statement: ($) =>
      seq(
        $.try_keyword,
        field("body", $.compound_statement),
        $.catch_keyword,
        field("handler", $.compound_statement)
      ),

    expression: ($) => choice($._expression_not_binary, $.binary_expression),

    _expression_not_binary: ($) =>
      choice(
        $.conditional_expression,
        $.assignment_expression,
        $.unary_expression,
        $.postfix_expression,
        $.call_expression,
        $.field_expression,
        $.subscript_expression,
        $.cast_expression,
        $.primary_expression,
        $.handle_dereference_expression
      ),

    primary_expression: ($) =>
      choice(
        $.identifier,
        $.qualified_identifier,
        $.number_literal,
        $.string_literal,
        $.boolean_literal,
        $.null_literal,
        $.parenthesized_expression,
        $.initializer_list,
        $.lambda_expression,
        $.template_function
      ),

    parenthesized_expression: ($) =>
      seq("(", choice($.expression, $.comma_expression), ")"),

    comma_expression: ($) =>
      seq(
        field("left", $.expression),
        ",",
        field("right", choice($.expression, $.comma_expression))
      ),

    conditional_expression: ($) =>
      prec.right(
        PREC.CONDITIONAL,
        seq(
          field("condition", $.expression),
          "?",
          field("consequence", $.expression),
          ":",
          field("alternative", $.expression)
        )
      ),

    handle_dereference_expression: ($) =>
      prec.right(
        PREC.UNARY,
        seq(field("operator", "@"), field("argument", $.expression))
      ),

    assignment_expression: ($) =>
      prec.right(
        PREC.ASSIGNMENT,
        seq(
          field("left", $._assignment_left_expression),
          field(
            "operator",
            choice(
              $.equal_op,
              $.plus_equal_op,
              $.sub_equal_op,
              $.mul_equal_op,
              $.div_equal_op,
              $.mod_equal_op,
              $.exp_equal_op,
              $.bitand_equal_op,
              $.bitor_equal_op,
              $.bitxor_equal_op,
              $.lsl_equal_op,
              $.lsr_equal_op,
              $.asr_equal_op
            )
          ),
          field("right", $.expression)
        )
      ),

    _assignment_left_expression: ($) =>
      choice(
        $.identifier,
        $.qualified_identifier,
        $.field_expression,
        $.subscript_expression,
        $.parenthesized_expression,
        $.handle_dereference_expression
      ),

    unary_expression: ($) =>
      prec.right(
        PREC.UNARY,
        seq(
          field(
            "operator",
            choice(
              $.not_op,
              $.bitnot_op,
              $.sub_op,
              $.plus_op,
              $.inc_op,
              $.dec_op
            )
          ),
          field("argument", $.expression)
        )
      ),

    postfix_expression: ($) =>
      prec.left(
        PREC.UNARY,
        seq(
          field("argument", $.expression),
          field("operator", choice($.inc_op, $.dec_op))
        )
      ),

    binary_expression: ($) => {
      /** @type {[Rule, number][]} */
      const table = [
        [$.exp_op, PREC.POWER],
        [$.mul_op, PREC.MULTIPLY],
        [$.div_op, PREC.MULTIPLY],
        [$.mod_op, PREC.MULTIPLY],
        [$.plus_op, PREC.ADD],
        [$.sub_op, PREC.ADD],
        [$.lsl_op, PREC.SHIFT],
        [$.lsr_op, PREC.SHIFT],
        [$.asr_op, PREC.SHIFT],
        [$.lt_op, PREC.RELATIONAL],
        [$.lte_op, PREC.RELATIONAL],
        [$.gt_op, PREC.RELATIONAL],
        [$.gte_op, PREC.RELATIONAL],
        [$.eq_op, PREC.EQUAL],
        [$.neq_op, PREC.EQUAL],
        [$.bitand_op, PREC.BITWISE_AND],
        [$.bitxor_op, PREC.EXCLUSIVE_OR],
        [$.bitor_op, PREC.INCLUSIVE_OR],
        [$.andand_op, PREC.LOGICAL_AND],
        [$.xorxor_op, PREC.LOGICAL_XOR],
        [$.oror_op, PREC.LOGICAL_OR],
      ];

      /** @type {[Rule, number][]} */
      const semanticOps = [
        [$.is_operator, PREC.EQUAL],
        [$.not_is_operator, PREC.EQUAL],
        [$.and_operator, PREC.LOGICAL_AND],
        [$.xor_operator, PREC.LOGICAL_XOR],
        [$.or_operator, PREC.LOGICAL_OR],
      ];

      return choice(
        ...table.map(([operator, precedence]) => {
          return prec.left(
            precedence,
            seq(
              field("left", $.expression),
              field("operator", operator),
              field("right", $.expression)
            )
          );
        }),
        ...semanticOps.map(([operator, precedence]) => {
          return prec.left(
            precedence,
            seq(
              field("left", $.expression),
              field("operator", operator),
              field("right", $.expression)
            )
          );
        })
      );
    },

    call_expression: ($) =>
      prec(
        PREC.CALL,
        seq(
          field("function", $.expression),
          field("arguments", $.argument_list)
        )
      ),

    field_expression: ($) =>
      prec.left(
        PREC.FIELD,
        seq(
          field("object", $.expression),
          ".",
          field("field", choice($._field_identifier, $.template_method))
        )
      ),

    subscript_expression: ($) =>
      prec(
        PREC.SUBSCRIPT,
        seq(
          field("array", $.expression),
          "[",
          field("index", commaSep1($.argument)),
          "]"
        )
      ),

    cast_expression: ($) =>
      prec(
        PREC.CAST,
        seq(
          $.cast_keyword,
          "<",
          field("type", $.type_descriptor),
          ">",
          "(",
          field("value", $.expression),
          ")"
        )
      ),

    argument_list: ($) => seq("(", commaSep($.argument), ")"),

    argument: ($) =>
      seq(
        optional(seq(field("name", $.identifier), ":")),
        field("value", $.expression)
      ),

    initializer_list: ($) =>
      seq("{", commaSep(choice($.expression, $.initializer_list)), "}"),

    lambda_expression: ($) =>
      seq(
        $.function_keyword,
        "(",
        commaSep($.lambda_parameter),
        ")",
        field("body", $.compound_statement)
      ),

    lambda_parameter: ($) =>
      choice(
        seq(field("type", $.type_descriptor), field("name", $.identifier)),
        field("type", $.type_descriptor),
        field("name", $.identifier)
      ),

    attribute_specifier: ($) => seq("[", "[", commaSep1($.attribute), "]", "]"),

    attribute_declaration: ($) =>
      seq("[", "[", commaSep1($.attribute), "]", "]"),

    attribute: ($) =>
      seq(field("name", $.identifier), optional($.attribute_argument_list)),

    attribute_argument_list: ($) => seq("(", commaSep($.expression), ")"),

    attributed_statement: ($) =>
      seq(repeat1($.attribute_declaration), $.statement),
  },
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return sep1(rule, ",");
}

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}
