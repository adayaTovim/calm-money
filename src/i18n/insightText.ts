import type { InsightRule } from '../utils/insights';
import type { Translations } from './translations';

export function getInsightText(ins: InsightRule, t: Translations) {
  const { id, data } = ins;
  switch (id) {
    case 'deficit':
      return { title: t.insight_deficit_title, observation: t.insight_deficit_obs, action: t.insight_deficit_action };
    case 'overspending':
      return { title: t.insight_overspend_title, observation: t.insight_overspend_obs, action: t.insight_overspend_action };
    case 'low-margin':
      return { title: t.insight_lowmargin_title, observation: t.insight_lowmargin_obs, action: t.insight_lowmargin_action };
    case 'pending-risk':
      return {
        title: t.insight_pending_title,
        observation: t.insight_pending_obs(data.pct ?? 0),
        action: t.insight_pending_action,
      };
    case 'category-concentration':
      return {
        title: t.insight_category_title(data.categoryName ?? ''),
        observation: t.insight_category_obs(data.categoryName ?? '', data.categoryPct ?? 0),
        action: t.insight_category_action,
      };
    case 'good-condition':
      return {
        title: t.insight_good_title,
        observation: t.health_score_desc(data.pct ?? 0),
        action: t.insight_good_action,
      };
  }
}
