# Contributing to TUI Designer

Thank you for your interest in contributing to TUI Designer! 🎉

## 📋 Getting Started

### 1. Read the Documentation

Before contributing, please read:
- [README.md](./README.md) - Project overview
- [docs/TUI_DESIGNER_OVERVIEW.md](./docs/TUI_DESIGNER_OVERVIEW.md) - Detailed vision
- [docs/TUI_DESIGNER_IMPLEMENTATION_PLAN.md](./docs/TUI_DESIGNER_IMPLEMENTATION_PLAN.md) - Technical roadmap

### 2. Set Up Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/tui-designer.git
cd tui-designer

# Install dependencies (once project is initialized)
npm install

# Start development server
npm run dev
```

## 🎯 Ways to Contribute

### Code Contributions
- Implement features from the [Implementation Plan](./docs/TUI_DESIGNER_IMPLEMENTATION_PLAN.md)
- Fix bugs
- Improve performance
- Add tests
- Refactor code

### Non-Code Contributions
- Write documentation
- Create tutorials and examples
- Design templates
- Build component libraries
- Report bugs
- Suggest features

## 🏗️ Development Workflow

### 1. Pick a Task

Check the [Implementation Plan](./docs/TUI_DESIGNER_IMPLEMENTATION_PLAN.md) for tasks:
- Look for unchecked `[ ]` items
- Start with Phase 1 or 2 if you're new
- Complex features (Phases 3+) need more context

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming:
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation
- `refactor/*` - Code refactoring
- `test/*` - Adding tests

### 3. Write Code

Follow these guidelines:
- Use TypeScript with strict types
- Follow the existing file structure
- Write clear, self-documenting code
- Add comments for complex logic
- Use meaningful variable names

#### Code Style

```typescript
// ✅ Good - Clear types, descriptive names
interface ComponentNode {
  id: string;
  type: ComponentType;
  name: string;
}

function addComponent(node: ComponentNode): void {
  // Implementation
}

// ❌ Bad - Unclear types, vague names
function add(n: any) {
  // Implementation
}
```

#### File Organization

```
src/
├── components/
│   ├── editor/
│   │   └── Canvas.tsx          # PascalCase for components
│   └── ui/
│       └── Button.tsx
├── stores/
│   └── componentStore.ts       # camelCase for stores
├── types/
│   └── components.ts           # lowercase for type files
└── utils/
    └── layoutEngine.ts         # camelCase for utilities
```

### 4. Test Your Changes

```bash
# Run tests (once test suite exists)
npm test

# Run linter
npm run lint

# Build to verify no errors
npm run build
```

### 5. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add drag-and-drop for components"
git commit -m "fix: resolve layout calculation bug"
git commit -m "docs: update quick start guide"
git commit -m "refactor: simplify component store logic"
```

Commit message format:
```
<type>: <description>

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting (no code change)
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance tasks

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub with:
- Clear title describing the change
- Description explaining what and why
- Reference to any related issues
- Screenshots/videos if UI changes

#### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test this?

## Checklist
- [ ] Code follows project style
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No new warnings
```

## 🎨 Design Guidelines

### Component Design
- Follow Figma-style patterns
- Keep components simple and focused
- Support all common TUI use cases
- Ensure accessibility

### UI/UX Principles
- Dark mode first (terminal aesthetic)
- Keyboard shortcuts for everything
- Clear visual feedback
- Consistent spacing and alignment

## 📝 Documentation Guidelines

### Code Documentation

```typescript
/**
 * Adds a component to the component tree
 *
 * @param parentId - ID of the parent component
 * @param component - Component to add
 * @returns The ID of the newly added component
 */
function addComponent(
  parentId: string,
  component: ComponentNode
): string {
  // Implementation
}
```

### Markdown Documentation

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep it up to date

## 🐛 Bug Reports

When reporting bugs, include:
1. **Description** - What happened?
2. **Steps to Reproduce** - How to trigger the bug?
3. **Expected Behavior** - What should happen?
4. **Actual Behavior** - What actually happened?
5. **Environment** - OS, Node version, browser
6. **Screenshots** - If applicable

## 💡 Feature Requests

When suggesting features, include:
1. **Problem** - What problem does this solve?
2. **Solution** - Your proposed solution
3. **Alternatives** - Other approaches considered
4. **Use Cases** - Who would use this?
5. **Examples** - Similar features in other tools

## 🔍 Code Review Process

### For Contributors
- Expect feedback and iteration
- Be open to suggestions
- Respond to comments promptly
- Keep PRs focused and small

### For Reviewers
- Be respectful and constructive
- Explain the "why" behind suggestions
- Approve or request changes clearly
- Test the changes locally

## 🎓 Learning Resources

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### React
- [React Documentation](https://react.dev/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Zustand
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### TUI Frameworks
- [OpenTUI](https://opentui.js.org/)
- [Ink](https://github.com/vadimdemedes/ink)
- [BubbleTea](https://github.com/charmbracelet/bubbletea)

## 📞 Getting Help

- **Questions**: [GitHub Discussions](https://github.com/yourusername/tui-designer/discussions)
- **Bugs**: [GitHub Issues](https://github.com/yourusername/tui-designer/issues)
- **Chat**: Discord (coming soon)

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Give constructive feedback
- Focus on what's best for the project
- Assume good intentions

## 🎉 Recognition

Contributors will be:
- Listed in README.md
- Credited in release notes
- Mentioned in announcements
- Given contributor badge

Thank you for contributing to TUI Designer! 🚀
