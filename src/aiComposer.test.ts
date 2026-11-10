import {
  generateCompositionFromPrompt,
  generateCompositionFromComponents,
  fitAndCenterScene,
  PRESET_THEMES,
  AI_SCENARIOS,
} from './aiComposer';
import type { CanvasFormat } from './types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('--- Running Studio Ochen AI Composer Test Suite ---');

// 1. Verify Structure & Counts: 5 Visible Presets & 20 Knowledge-Base Scenarios
{
  console.log('Test 1: Presets & Scenarios Counts');
  assert(PRESET_THEMES.length === 5, `Expected exactly 5 visible presets, got ${PRESET_THEMES.length}`);
  assert(AI_SCENARIOS.length === 20, `Expected exactly 20 knowledge-base scenarios, got ${AI_SCENARIOS.length}`);
  console.log('  ✓ 5 visible presets and 20 knowledge-base scenarios verified');
}

// 2. Test Preset Theme: Journalism & Writing (User Reference Image 3 Layout)
{
  console.log('Test 2: Journalism & Writing layout exact alignment');
  const journalismPreset = PRESET_THEMES.find(p => p.title === 'Журналистика и писательство')!;
  const res = generateCompositionFromPrompt(journalismPreset.prompt, '1:1', 'L');
  assert(res.items.length === 3, `Expected 3 items, got ${res.items.length}`);
  
  const lamp = res.items.find(i => i.objectType === 'lamp');
  const notebook = res.items.find(i => i.objectType === 'notebook');
  const pen = res.items.find(i => i.objectType === 'pen');
  
  assert(!!lamp, 'Lamp must be in Journalism scene');
  assert(!!notebook, 'Notebook must be in Journalism scene');
  assert(!!pen, 'Pen must be in Journalism scene');
  
  // Verify Lamp upper-left anchor
  assert(lamp!.state === 'bg', 'Lamp should be bg monochrome');
  assert(lamp!.x >= 250 && lamp!.x <= 300, `Lamp x=${lamp!.x} should be 250..300`);
  assert(lamp!.y >= 260 && lamp!.y <= 320, `Lamp y=${lamp!.y} should be 260..320`);
  assert(lamp!.zIndex === 0, `Lamp zIndex should be 0, got ${lamp!.zIndex}`);

  // Verify Notebook lower-right foreground
  assert(notebook!.state === 'main', 'Notebook should be main');
  assert(notebook!.x >= 750 && notebook!.x <= 800, `Notebook x=${notebook!.x} should be 750..800`);
  assert(notebook!.y >= 780 && notebook!.y <= 830, `Notebook y=${notebook!.y} should be 780..830`);
  assert(notebook!.zIndex > lamp!.zIndex, 'Notebook must be in front of lamp');

  // Verify Pen placed along bookmark / lower edge
  assert(pen!.state === 'main', 'Pen should be main');
  assert(pen!.x >= 320 && pen!.x <= 360, `Pen x=${pen!.x} should be 320..360`);
  assert(pen!.y >= 840 && pen!.y <= 880, `Pen y=${pen!.y} should be 840..880`);
  assert(pen!.zIndex > notebook!.zIndex, 'Pen must be on top of notebook');
  
  console.log('  ✓ Journalism & Writing layout passed with exact user-aligned coordinates');
}

// 3. Test Preset Theme: Finance & Budget (Studio Card 5 - No Lamp Base Overlap)
{
  console.log('Test 3: Finance & Budget (Studio Card 5 - No Lamp Base Collision)');
  const financePreset = PRESET_THEMES.find(p => p.title === 'Личные финансы и бюджет')!;
  const res = generateCompositionFromPrompt(financePreset.prompt, '1:1', 'L');
  assert(res.items.length === 3, `Expected 3 items, got ${res.items.length}`);
  
  const lamp = res.items.find(i => i.objectType === 'lamp');
  const wallet = res.items.find(i => i.objectType === 'wallet');
  const coin = res.items.find(i => i.objectType === 'coin');
  
  assert(!!lamp, 'Lamp must be in Finance scene');
  assert(!!wallet, 'Wallet must be in Finance scene');
  assert(!!coin, 'Coin must be in Finance scene');

  assert(lamp!.x >= 180 && lamp!.x <= 220, `Lamp x=${lamp!.x} should be 180..220`);
  assert(wallet!.x >= 400 && wallet!.x <= 450, `Wallet x=${wallet!.x} should be 400..450`);
  assert(wallet!.y >= 660 && wallet!.y <= 720, `Wallet y=${wallet!.y} should be 660..720`);
  assert(coin!.x >= 630 && coin!.x <= 690, `Coin x=${coin!.x} should be 630..690`);
  assert(coin!.y >= 480 && coin!.y <= 540, `Coin y=${coin!.y} should be 480..540`);

  // Verify no overlap: wallet must be placed below lamp base and shadow
  assert(wallet!.y > lamp!.y + 400, 'Wallet must be placed below lamp base');
  assert(coin!.x > wallet!.x + 150, 'Coin must be placed to the right of wallet along 30 deg axis');
  console.log('  ✓ Finance & Budget Card 5 layout passed without lamp base collision');
}

// 4. Test Preset Theme: Music & Relaxation (Studio Card 4)
{
  console.log('Test 4: Music & Relaxation (Studio Card 4 - Flowers + Headphones)');
  const musicPreset = PRESET_THEMES.find(p => p.title === 'Музыка и отдых')!;
  const res = generateCompositionFromPrompt(musicPreset.prompt, '1:1', 'L');
  const flowers = res.items.find(i => i.objectType === 'flowers');
  const headphones = res.items.find(i => i.objectType === 'headphones');
  
  assert(!!flowers, 'Flowers must be in Music scene');
  assert(!!headphones, 'Headphones must be in Music scene');
  assert(flowers!.state === 'bg', 'Flowers should be bg monochrome');
  assert(headphones!.state === 'main', 'Headphones should be main color');
  assert(headphones!.zIndex > flowers!.zIndex, 'Headphones must be in foreground');
  assert(res.recommendedPalette === 'mint', 'Music preset must recommend mint palette');
  console.log('  ✓ Music Card 4 layout passed');
}

// 5. Test Preset Theme: IT-Startup & Dev (Studio Card 1)
{
  console.log('Test 5: IT-Startup & Development (Phone + Puzzle)');
  const itPreset = PRESET_THEMES.find(p => p.title === 'IT-стартап и разработка')!;
  const res = generateCompositionFromPrompt(itPreset.prompt, '1:1', 'L');
  const phone = res.items.find(i => i.objectType === 'phone');
  const puzzle = res.items.find(i => i.objectType === 'puzzle');
  
  assert(!!phone, 'Phone must be in IT-Startup scene');
  assert(!!puzzle, 'Puzzle must be in IT-Startup scene');
  assert(phone!.x < puzzle!.x, 'Phone must be lower-left from puzzle');
  assert(phone!.y > puzzle!.y, 'Phone must be lower-left from puzzle');
  console.log('  ✓ IT-Startup Card 1 layout passed');
}

// 6. Test Preset Theme: Workspace & Order (Folder + Pen + Lamp)
{
  console.log('Test 6: Workspace & Order (Folder + Pen + Lamp)');
  const workspacePreset = PRESET_THEMES.find(p => p.title === 'Рабочее пространство и порядок')!;
  const res = generateCompositionFromPrompt(workspacePreset.prompt, '1:1', 'L');
  const folder = res.items.find(i => i.objectType === 'folder');
  const pen = res.items.find(i => i.objectType === 'pen');
  const lamp = res.items.find(i => i.objectType === 'lamp');
  
  assert(!!folder, 'Folder must be in Workspace scene');
  assert(!!pen, 'Pen must be in Workspace scene');
  assert(!!lamp, 'Lamp must be in Workspace scene');
  assert(pen!.x > lamp!.x + 180, 'Pen must be clear of lamp base to avoid collision');
  console.log('  ✓ Workspace layout passed');
}

// 7. Verify All 20 Scenarios Generate Valid Compositions & Exact Studio Objects
{
  console.log('Test 7: Verification of all 20 knowledge-base scenarios');
  
  // Exact expected items map according to user requirements
  const EXPECTED_SCENARIO_ITEMS: Record<string, string[]> = {
    'music_relaxation': ['headphones', 'flowers'],
    'personal_finance': ['wallet', 'lamp', 'coin'],
    'journalism_writing': ['notebook', 'lamp', 'pen'],
    'it_startup_dev': ['phone', 'lamp', 'puzzle'],
    'workspace_order': ['folder', 'lamp', 'pen'],
    'cybersecurity': ['wallet', 'puzzle', 'coin'],
    'education_lectures': ['notebook', 'phone', 'pen'],
    'law_contracts': ['folder', 'notebook', 'pen'],
    'mobile_apps': ['phone', 'headphones', 'puzzle'],
    'crypto_investments': ['wallet', 'folder', 'coin'],
    'digital_marketing': ['phone', 'folder', 'puzzle'],
    'travel_impressions': ['headphones', 'flowers', 'phone'],
    'cozy_home': ['notebook', 'lamp', 'flowers'],
    'logistics_supply': ['folder', 'puzzle', 'coin'],
    'design_creative': ['notebook', 'puzzle', 'pen'],
    'science_research': ['notebook', 'lamp', 'puzzle'],
    'ecommerce_retail': ['wallet', 'phone', 'coin'],
    'management_planning': ['folder', 'pen', 'coin'],
    'podcasts_media': ['headphones', 'lamp', 'phone'],
    'self_development': ['notebook', 'flowers', 'pen']
  };

  for (let idx = 0; idx < AI_SCENARIOS.length; idx++) {
    const sc = AI_SCENARIOS[idx];
    const res = generateCompositionFromPrompt(sc.title, '1:1', 'L');
    
    assert(res.items.length >= 2 && res.items.length <= 3, `Scenario "${sc.title}" must have 2 or 3 items, got ${res.items.length}`);
    
    // Check all required items are present
    const expected = EXPECTED_SCENARIO_ITEMS[sc.id];
    assert(!!expected, `Missing expectation for scenario ${sc.id}`);
    for (const reqObj of expected) {
      const hasObj = res.items.some(i => i.objectType === reqObj);
      assert(hasObj, `Scenario "${sc.title}" must contain object "${reqObj}"`);
    }

    // Specific check for Scenario 15: Design must have Notebook, Puzzle, Pen
    if (sc.id === 'design_creative') {
      assert(res.items.some(i => i.objectType === 'notebook'), 'Design must contain notebook');
      assert(res.items.some(i => i.objectType === 'puzzle'), 'Design must contain puzzle');
      assert(res.items.some(i => i.objectType === 'pen'), 'Design must contain pen');
      const themeLower = res.matchedTheme.toLowerCase();
      assert(themeLower.includes('блокнот') && themeLower.includes('пазл') && themeLower.includes('ручк'),
        `Design matchedTheme should include all 3 objects, got: ${res.matchedTheme}`);
    }

    // Specific check for Scenario 18: Management must have Folder, Pen, Coin (and NO lamp!)
    if (sc.id === 'management_planning') {
      assert(res.items.some(i => i.objectType === 'folder'), 'Management must contain folder');
      assert(res.items.some(i => i.objectType === 'pen'), 'Management must contain pen');
      assert(res.items.some(i => i.objectType === 'coin'), 'Management must contain coin');
      assert(!res.items.some(i => i.objectType === 'lamp'), 'Management must NOT contain lamp');
      const themeLower = res.matchedTheme.toLowerCase();
      assert(themeLower.includes('папк') && themeLower.includes('ручк') && themeLower.includes('монет'),
        `Management matchedTheme should include all 3 objects, got: ${res.matchedTheme}`);
    }

    // Recommended palette
    assert(res.recommendedPalette === sc.palette, `Scenario "${sc.title}" palette mismatch: expected ${sc.palette}, got ${res.recommendedPalette}`);
    
    // All items must have valid coordinates and scales
    for (const item of res.items) {
      assert(!isNaN(item.x) && !isNaN(item.y) && !isNaN(item.scale), `Scenario "${sc.title}" item ${item.objectType} has NaN coordinates`);
      assert(item.scale >= 0.5 && item.scale <= 1.3, `Scenario "${sc.title}" scale out of bounds: ${item.scale}`);
    }
    
    // Rationale must explain the decision
    assert(res.rationale.length > 50, `Scenario "${sc.title}" has insufficient rationale length`);
    assert(res.rationale.includes(sc.title), `Scenario "${sc.title}" rationale must mention scenario title`);
  }
  console.log('  ✓ All 20 scenarios generated valid 2-3 item scenes with exact Studio Ochen objects');
}

// 8. Test Semantic Intelligence with Realistic Editorial Headlines & Multilingual Support
{
  console.log('Test 8: Semantic Intelligence with Real-World Prompts');
  
  // 8a. Cybersecurity
  const resSec = generateCompositionFromPrompt('Защита персональных данных пользователей и шифрование паролей от хакерских атак', '1:1', 'L');
  assert(resSec.rationale.includes('Кибербезопасность'), `Expected cybersecurity scenario, got: ${resSec.rationale.split('\n')[0]}`);
  assert(resSec.items.some(i => i.objectType === 'wallet'), 'Cybersecurity must contain wallet storage');

  // 8b. Law & Contracts
  const resLaw = generateCompositionFromPrompt('Анализ судебной практики и согласование договоров аренды в арбитраже', '1:1', 'L');
  assert(resLaw.rationale.includes('Юриспруденция'), `Expected law scenario, got: ${resLaw.rationale.split('\n')[0]}`);
  assert(resLaw.items.some(i => i.objectType === 'folder'), 'Law must contain folder');
  assert(resLaw.items.some(i => i.objectType === 'pen'), 'Law must contain signing pen');

  // 8c. Crypto Investments (Verify "риск" does NOT false-trigger Law due to "иск")
  const resCrypto = generateCompositionFromPrompt('Управление инвестиционными рисками и покупка биткоина в портфель', '1:1', 'L');
  assert(resCrypto.rationale.includes('Инвестиции и крипта'), `Expected crypto scenario, got: ${resCrypto.rationale.split('\n')[0]}`);
  assert(resCrypto.items.some(i => i.objectType === 'wallet'), 'Crypto must contain crypto wallet');
  assert(resCrypto.items.some(i => i.objectType === 'coin'), 'Crypto must contain token coin');

  // 8d. Logistics & Supply
  const resLogistics = generateCompositionFromPrompt('Оптимизация цепочек поставок, складской учет и расчет стоимости грузоперевозок', '1:1', 'L');
  assert(resLogistics.rationale.includes('Логистика'), `Expected logistics scenario, got: ${resLogistics.rationale.split('\n')[0]}`);
  assert(resLogistics.items.some(i => i.objectType === 'folder'), 'Logistics must contain folder');

  // 8e. Podcasts & Media
  const resPodcast = generateCompositionFromPrompt('Как запустить авторский подкаст на Spotify, настроить микрофон и студийный звук', '1:1', 'L');
  assert(resPodcast.rationale.includes('Подкасты'), `Expected podcast scenario, got: ${resPodcast.rationale.split('\n')[0]}`);
  assert(resPodcast.items.some(i => i.objectType === 'headphones'), 'Podcast must contain headphones');

  // 8f. Cozy Home
  const resCozy = generateCompositionFromPrompt('Скандинавский хюгге: как создать уют, тепло и покой в домашнем интерьере', '1:1', 'L');
  assert(resCozy.rationale.includes('Уют'), `Expected cozy home scenario, got: ${resCozy.rationale.split('\n')[0]}`);

  // 8g. Self-development
  const resSelf = generateCompositionFromPrompt('Утренние ритуалы, медитация, осознанность и трекинг полезных привычек', '1:1', 'L');
  assert(resSelf.rationale.includes('Саморазвитие'), `Expected self-development scenario, got: ${resSelf.rationale.split('\n')[0]}`);

  // 8h. Design with Color Palette (Verify "цветовая гамма" does NOT confuse as flower)
  const resDesignColor = generateCompositionFromPrompt('Цветовая палитра и UI дизайн интерфейса', '1:1', 'L');
  assert(resDesignColor.items.some(i => i.objectType === 'notebook' || i.objectType === 'puzzle'), 'UI design must focus on design objects');
  assert(!resDesignColor.items.some(i => i.objectType === 'flowers'), 'UI design with color palette must NOT inject flowers');

  // 8i. Multilingual English prompts
  const resEnSecurity = generateCompositionFromPrompt('Enterprise cybersecurity protocols, auth tokens and hacker defense', '1:1', 'L');
  assert(resEnSecurity.rationale.includes('Кибербезопасность'), 'English security prompt should map to Cybersecurity');

  const resEnLogistics = generateCompositionFromPrompt('Global supply chain optimization, freight delivery and warehouse management', '1:1', 'L');
  assert(resEnLogistics.rationale.includes('Логистика'), 'English supply chain prompt should map to Logistics');

  const resEnPodcast = generateCompositionFromPrompt('New podcast episode recording with broadcast microphone and audio stream', '1:1', 'L');
  assert(resEnPodcast.rationale.includes('Подкасты'), 'English podcast prompt should map to Podcasts');

  console.log('  ✓ Semantic scoring accurately mapped all realistic prompts to distinct scenarios');
}

// 9. Test All Canvas Formats (16:9, 9:16, 4:3, 1:1)
{
  console.log('Test 9: All canvas formats');
  const formats: CanvasFormat[] = ['1:1', '16:9', '9:16', '4:3'];
  for (const fmt of formats) {
    const res = generateCompositionFromPrompt('журналистика автор статья', fmt, 'L');
    assert(res.items.length === 3, `Expected 3 items in format ${fmt}`);
    for (const it of res.items) {
      assert(!isNaN(it.x) && !isNaN(it.y) && !isNaN(it.scale), `Valid numbers in format ${fmt}`);
      assert(it.scale > 0.4 && it.scale < 1.3, `Reasonable scale ${it.scale} in format ${fmt}`);
    }
  }
  console.log('  ✓ All canvas formats verified');
}

// 10. Test Edge Cases: Empty Prompt, Gibberish, Explicit Object Adaptation, Components
{
  console.log('Test 10: Edge cases and dynamic adaptations');
  
  // Empty prompt
  const resEmpty = generateCompositionFromPrompt('', '1:1', 'L');
  assert(resEmpty.items.length >= 2, 'Empty prompt must produce a balanced default scene');
  assert(resEmpty.rationale.includes('Сбалансированная генерация'), 'Empty prompt rationale should indicate balanced default');
  
  // Gibberish prompt
  const resGibberish = generateCompositionFromPrompt('qwerty asdfgh zxcvbn', '1:1', 'L');
  assert(resGibberish.items.length >= 2, 'Gibberish prompt must produce a fallback scene');

  // Explicit object request adaptation
  const resExplicit = generateCompositionFromPrompt('Хочу минималистичную композицию с кошельком и телефоном', '1:1', 'L');
  assert(resExplicit.items.some(i => i.objectType === 'wallet'), 'Explicit request must include wallet');
  assert(resExplicit.items.some(i => i.objectType === 'phone'), 'Explicit request must include phone');

  // Scenario 2: Manual component selection
  const res1 = generateCompositionFromComponents(['lamp'], '1:1', 'L');
  assert(res1.length >= 2, 'Single component selection should auto-pair companions');

  const res2 = generateCompositionFromComponents(['phone', 'puzzle'], '1:1', 'L');
  assert(res2.length === 2, 'Two components should create clean pair');

  const res3 = generateCompositionFromComponents(['notebook', 'lamp', 'pen'], '1:1', 'L');
  assert(res3.length === 3, 'Three components should place all three');

  // Format transition with fitAndCenterScene
  const centered = fitAndCenterScene(res3, '16:9');
  assert(centered.length === 3, 'fitAndCenterScene should preserve items count');
  console.log('  ✓ Edge cases and dynamic adaptations verified successfully');
}

console.log('--- All tests passed with 100% success! ---');
