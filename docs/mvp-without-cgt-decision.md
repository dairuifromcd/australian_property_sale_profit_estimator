# MVP 决策建议：正式版移除 CGT 数值功能

- **状态：** 已实施，待 Preview 验收
- **记录日期：** 2026-07-22
- **适用版本：** 首个正式公开 MVP

## 1. 决策摘要

首个正式公开 MVP 移除资本利得税（CGT）数值估算，把产品聚焦为澳洲房产出售成本、出售所得、基于已输入交易成本的交易利润和保本售价计算器。

正式版继续回答三个核心问题：

1. 扣除用户输入的中介佣金和出售费用后，预计还剩多少出售所得；
2. 扣除买入价、购入费用、出售准备费用和装修或改善投入后，整套房产预计产生多少交易利润或亏损；
3. 在已输入交易成本的假设下，至少需要卖到什么价格才能保本。

正式版不计算 CGT、应纳税资本利得、个人所得税或税后利润。CGT 可在未来满足专业审查和产品验证条件后，作为独立功能重新评估。

## 2. 为什么建议移除 CGT 数值功能

### 2.1 CGT 不是可以通过少量输入完整推导的独立税种

资本利得会进入个人所得税体系。实际结果可能受到以下因素影响：

- 纳税居民身份和纳税主体类型；
- 同一财年的其他资本利得和资本损失；
- 以前年度结转的资本损失；
- 自住房完整或部分豁免条件；
- 房产出租、经营或混合用途期间；
- absence choice、市场估值和特殊 cost-base 规则；
- 已申报或可申报的 capital works deductions；
- 持有期、合同日期及折扣适用资格；
- 用户其他收入、Medicare levy、offsets 和完整税务情况；
- 2027 年 7 月 1 日起的新 CGT 规则和过渡安排。

当前的单一假设税率模型只能表示有限情景。即使页面明确写明“indicative”，数值结果仍可能让用户产生不符合产品能力的精确感。

### 2.2 免责声明、`beta` 和 `noindex` 不能代替准确性与合规判断

免责声明可以帮助解释产品边界，但不能单独决定 Tax Agent Services Act 2009 是否适用。TPB 会结合服务内容、用户是否会合理依赖、服务复杂程度以及是否收取 fee or other reward 等事实判断。

TPB 指南同时说明，非定制软件即使包含 tax calculator，也不一定构成 tax agent service；发布在网站、且不把税法应用到用户具体情况的一般税务信息也可能不属于 tax agent service。完全公益且没有 fee or other reward 的服务，和以未来业务、引流、销售或佣金为回报的服务，也可能得到不同结论。

因此，移除 CGT 是基于首版产品范围、用户误解风险和持续维护成本作出的保守产品决策，不是对现有功能违法性的认定。若未来出现收费、引流、推荐佣金、个性化支持或其他商业回报，应根据届时的完整运营事实取得适当的澳洲法律意见。

`noindex` 只控制支持该指令的搜索引擎是否展示某个 URL；它不是访问控制，也不会改变公开页面所提供的服务性质。长期标记为 `beta` 同样不会修复错误计算或误导性的整体印象。

因此，不应以免责声明、`beta` 或 `noindex` 作为保留未充分验证 CGT 数值功能的主要依据。

### 2.3 专业审查和持续维护成本与首版核心价值不匹配

保留 CGT 数值功能需要：

- 注册税务代理对公式、适用条件、测试案例和用户文案进行范围明确的独立审查；
- 对法规变化建立持续监控和版本记录；
- 为复杂或不支持情形设计可靠的拒绝计算机制；
- 对每次规则调整重新进行回归测试和必要的专业复核；
- 在商业模式发生收费、推荐佣金或个性化支持变化时重新评估监管边界。

这些投入适合经过需求验证后的后续产品阶段，不适合成为首个正式 MVP 的主要复杂度来源。

### 2.4 移除 CGT 会使产品定位和用户理解更清晰

无 CGT 的正式版可以围绕“卖房成本和基于已输入成本的交易结果”形成单一价值主张，减少以下常见混淆：

- 把出售所得误认为最终 settlement cash；
- 把交易利润误认为 taxable capital gain；
- 把简化 CGT 结果误认为正式税单；
- 不理解 assumed tax rate、taxable-use percentage 或 cost-base override；
- 因高级税务字段过多而放弃最基本的估算。

更短的流程也更有利于真实用户测试和首版转化验证。

### 2.5 降低风险不等于降低准确性要求

移除 CGT 后，剩余计算仍必须准确、可解释并经过自动化测试。页面仍需明确区分：

- 出售所得与 settlement cash；
- 基于已输入成本的交易利润与完整经济、会计或税务利润；
- 用户输入的成本假设与实际报价或结算金额。

本决策不是“用免责声明代替质量控制”，而是把首版模型限制在更容易正确实现和验证的范围内。

## 3. 去掉 CGT 后仍然提供的用户价值

### 3.1 核心价值主张

建议采用以下英文定位：

> Estimate your selling costs, proceeds before debt and tax, transaction profit before holding costs, debt and tax, and the break-even sale price for the costs you enter.

对应的中文含义是：

> 估算房产出售费用、债务和税务前的出售所得、未计持有成本、债务和税务的交易利润，以及基于已输入交易成本的保本售价。

### 3.2 用户可以完成的主要任务

- 在收到中介报价后估算佣金对结果的影响；
- 判断预计售价是否覆盖买入价和主要交易成本；
- 比较不同出售费用或准备预算下的利润；
- 计算实现保本所需的最低售价；
- 打印或保存结果，与中介、会计师、conveyancer 或 solicitor 讨论；
- 识别还需要向专业人士确认的成本和税务事项。

### 3.3 明确不回答的问题

正式 MVP 不回答：

- 最终需要缴纳多少 CGT 或所得税；
- 交割日实际到账金额；
- 扣除贷款余额和 discharge fee 后的净现金；
- 包含利息、rates、insurance、maintenance、rent 和 depreciation 的完整持有期回报；
- 房产估值、出售建议、法律建议或个人财务建议。

## 4. 正式 MVP 的功能范围

### 4.1 保留的输入

**快速估算：**

- Expected sale price；
- Original purchase price；
- Agent commission，明确使用包含 GST 的报价比例；
- Other selling costs。

**详细估算：**

- Sale preparation costs；
- Purchase costs；
- Renovations and improvements。

### 4.2 保留的结果

- Agent commission；
- Total selling costs；
- Sale proceeds after selling costs；
- Whole-property transaction profit or loss before holding costs, debt and tax；
- Break-even sale price for the entered transaction costs；
- 清晰的逐项成本分解；
- 打印或保存为 PDF。

### 4.3 从正式版移除的功能

- “Include an indicative CGT estimate”开关；
- Property use；
- Purchase contract date 和 expected sale contract date；
- Ownership share（先随 CGT 模块移除，后续可作为独立非税务功能重新加入）；
- Assumed tax rate；
- Taxable portion of the gain；
- Main residence exemption confirmation；
- Capital works deductions；
- ATO cost base override；
- Derived cost base；
- Raw、taxable capital gain 和 capital loss；
- Estimated CGT 和 after-tax profit；
- 12-month CGT discount 判断；
- 2027 年规则边界和暂停信息。

## 5. 文案和信息架构调整

### 5.1 字段名称

| 当前文案 | 建议文案 | 原因 |
| --- | --- | --- |
| Eligible selling costs | Other selling costs | 避免暗示工具已经判断某项费用符合 CGT cost-base 资格 |
| Capital improvements | Renovations and improvements | 保留经济投入概念，同时减少税务分类暗示 |
| Sale proceeds after selling costs | 保留 | 但必须在附近说明 before debt and tax |
| Whole-property pre-tax profit | Whole-property transaction profit before holding costs, debt and tax | 当前模型排除了利息、rates、insurance、maintenance、rent 等持有现金流，不应称为完整 economic profit |
| Estimated break-even sale price | Break-even sale price for the entered transaction costs | 避免暗示已经覆盖全部持有成本、债务和税务 |

### 5.2 结果页必须持续展示的限制

- 结果是 indicative estimate；
- 出售所得尚未扣除贷款余额、loan discharge 和 settlement adjustments；
- 交易利润不包含历史持有现金流、债务和税务；
- 本工具不计算 CGT、所得税或税后利润；
- 实际费用和重要决策应与适当的澳洲专业人士确认。

### 5.3 页面和仓库中需要清理的 CGT 表述

- 首页 hero、功能介绍和 footer；
- SEO title、description 和 keywords；
- Important information 页面；
- README 功能列表、计算模型和免责声明；
- calculation scenario coverage 文档；
- 单元测试、E2E 测试和 rendered HTML 测试；
- 任何 ATO cost base、main residence exemption、50% discount 或 2027 改革描述。

ATO 链接可以从核心计算流程中移除。若保留，可仅作为“本工具不计算税务，请另行确认”的补充资源，不能让页面形成已经提供税务判断的印象。

## 6. 建议增加的非 CGT 功能

以下功能能够提高实用性，同时不重新引入个人税务计算。

### P1：适合首个正式 MVP

- 售价情景比较，例如预计售价上下浮动 5%；
- “达到目标利润需要卖多少钱”；
- 比较不同中介佣金报价；
- 保持打印或保存结果；
- 结果中突出哪些数字来自用户输入、哪些由模型计算。

如果需要严格控制首版范围，P1 功能可以在核心删减完成后逐项加入，不应阻塞无 CGT MVP 发布。

### P2：需求验证后再考虑

- 独立的 ownership share，用于按产权比例展示交易利润；
- 可选贷款余额，用于展示“贷款前出售所得”和“扣除输入贷款余额后的简单现金情景”；
- 历史持有成本和租金现金流；
- 多个方案保存和比较。

P2 功能需要新的文案、测试和用户验证，不能直接混入当前公式。

## 7. 代码和测试改动范围

### 7.1 主要代码

- `app/page.tsx`：移除 CGT 表单和 `TaxResult` 展示，更新字段、结果和 footer 文案；
- `app/calculator.ts`：删除 CGT 输入、状态、校验和计算分支，只保留出售所得、基于已输入成本的交易利润和保本售价；
- `app/layout.tsx`：移除 CGT SEO 关键词；正式上线批准后，将主站从全局 `noindex` 调整为允许索引；
- `app/disclaimer/page.tsx`：重写为无税务数值功能的产品边界；
- `app/privacy/page.tsx`：确认实际数据流描述仍与实现一致；
- `app/globals.css`：移除不再使用的 CGT 组件样式。

### 7.2 测试和文档

- `tests/calculator.test.ts`：保留并扩充快速估算、详细成本、亏损、零值、负数和佣金边界测试；
- `tests/e2e/calculator.spec.ts`：删除 CGT 流程，强化核心流程、移动端和结果解释测试；
- `tests/e2e/compliance.spec.ts`：检查 debt、tax、holding cash flow 等重要限制；
- `tests/rendered-html.test.mjs`：确认公开 HTML 不再宣传 CGT 数值功能；
- `docs/calculation-scenarios.md`：改写为无 CGT 的场景覆盖矩阵；
- `README.md`：同步产品定位、功能范围、公式和明确排除项。

## 8. 发布验收标准

正式 MVP 至少满足以下条件：

- 页面、HTML、metadata 和 README 不再承诺或输出 CGT 数值；
- 核心计算公式拥有单元测试和浏览器端到端测试；
- 所有输入错误不会静默转成可能误导的有效结果；
- 用户能明显看见结果是 before debt and tax；
- 页面不把出售所得描述成 settlement cash；
- 页面不把交易利润描述成 taxable gain、完整 economic profit 或 accounting profit；
- 重要限制在结果附近可见，而不是只放在独立免责声明页面；
- Privacy 页面准确描述浏览器计算、Cloudflare 请求元数据及任何新增分析工具；
- `npm run lint`、`npm test` 和 `npm run test:e2e` 全部通过。

真实用户价值验证仍然有价值，但本次决策将其暂时搁置，不作为移除 CGT 或发布无 CGT Preview 的前置条件。后续恢复用户测试时，应重点验证用户是否理解交易利润、settlement cash 和完整持有期回报之间的区别。

## 9. 上线方式

1. 当前完整 CGT 版本已归档为 Git 标签 `v0.1.0-cgt-beta`；
2. 在 Preview URL 中完成无 CGT 版本改造，并继续保持 `noindex`；
3. 完成自动化测试和对抗性审查；
4. 检查公开文案、Privacy 和 Important information；
5. 正式发布后再单独决定是否允许核心网站被搜索引擎索引；
6. 不在同一个正式页面中保留隐藏或折叠的 CGT 代码路径。

## 10. 未来重新引入 CGT 的前置条件

未来如重新提供 CGT 数值功能，建议至少满足：

- 作为独立模块或独立 URL 开发，避免影响核心估算流程；
- 由具有澳洲房产 CGT 经验的 TPB 注册税务代理审查模型、适用条件、固定案例和用户文案；
- 如存在收费、引流、推荐佣金或个性化支持，由适当的澳洲法律专业人士评估运营模式；
- 建立法规来源、最后审查日期、变更监控和版本记录；
- 对不支持或资料不足的情形拒绝输出数值，而不是用默认假设补齐；
- 完成独立的真实用户理解测试；
- 明确决定该模块是受控 beta、公开 `noindex` 工具还是正式可索引产品。

专业审查不代表 ATO 批准或政府认证，除非存在真实且可证明的授权，不应使用“ATO approved”“ATO compliant”或“政府认可”等表述。

## 11. 官方参考资料

- [TPB：What is a tax agent service?](https://www.tpb.gov.au/tpb-gs-44-2023-what-is-tax-agent-service)
- [TPB：Digital service providers and the Tax Agent Services Act 2009](https://www.tpb.gov.au/tpb-gs-14-2011-digital-service-providers-and-tax-agent-services-act-2009)
- [TPB：What is a fee or other reward?](https://www.tpb.gov.au/tpb-gs-45-2023-what-is-fee-or-other-reward)
- [Federal Register of Legislation：Tax Agent Services Act 2009](https://www.legislation.gov.au/C2009A00013/latest)
- [ATO：How to calculate your CGT](https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/calculating-your-cgt/how-to-calculate-your-cgt)
- [ACCC：False or misleading claims](https://www.accc.gov.au/business/advertising-and-promotions/false-or-misleading-claims)
- [OAIC：Privacy guidance for start-ups](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/start-ups)
- [Google Search Central：Block Search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
