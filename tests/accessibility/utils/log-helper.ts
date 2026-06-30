import chalk from 'chalk';
import type { Result } from '@axe-core/playwright';

export function logViolationsAsWarning(url: string, violations: Result[]) {
  if (violations.length === 0) return;

  console.warn(chalk.yellow.bold(`\n\n⚠️ Accessibility violations found for: ${url}\n`));

  for (const violation of violations) {
    const impact = violation.impact ? violation.impact.toUpperCase() : 'UNKNOWN';
    console.warn(chalk.red(`[${impact}] ${violation.id}`));
    console.warn(chalk.white(`Description: ${violation.help}`));
    console.warn(chalk.cyan(`Help: ${violation.helpUrl}`));
    
    if (violation.nodes && violation.nodes.length > 0) {
      console.warn(chalk.gray(`Affected Nodes:`));
      for (const node of violation.nodes) {
        console.warn(chalk.gray(`  - ${node.target.join(', ')}`));
      }
    }
    console.warn('');
  }
}
