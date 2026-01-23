module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 100],
    "subject-case": [0],
    "subject-full-stop": [0],
    "header-match-team-pattern": [2, "always"],
  },
  plugins: [
    {
      rules: {
        "header-match-team-pattern": (parsed) => {
          const { header } = parsed;
          // Matches: type(scope?): description (PROJECT-123)
          const pattern =
            /^(fix|chore|feat|docs|test|refactor|style|perf|ci|build)(\([a-z0-9-]+\))?: .+ \(([A-Z0-9]+)-[0-9]+\)$/;
          if (pattern.test(header)) {
            return [true];
          }
          return [
            false,
            "header must follow pattern: type(scope?): description (TASK-123)\nExample: feat: add login (ADV-34)",
          ];
        },
      },
    },
  ],
};
