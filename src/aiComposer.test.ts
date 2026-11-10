import {
  generateCompositionFromPrompt,
  generateCompositionFromComponents,
  fitAndCenterScene,
  PRESET_THEMES,
  AI_SCENARIOS,
} from './aiComposer';
import type { CanvasFormat } from './types';
import { DEFAULT_PALETTES } from './palettes';
import { getBackgroundDecorSVG } from './components/BackgroundDecor';
import { buildStandaloneSVG } from './svgExporter';

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

// 11. Test Clumping Prevention: Podcasts & Media Layout Matching User Reference Image 2
{
  console.log('Test 11: Anti-Clumping & Harmonious Negative Space (User Reference Image 2)');
  const res = generateCompositionFromPrompt('Подкасты и медиа', '1:1', 'L');
  assert(res.items.length === 3, `Expected 3 items in Podcasts scene, got ${res.items.length}`);

  const lamp = res.items.find(i => i.objectType === 'lamp');
  const headphones = res.items.find(i => i.objectType === 'headphones');
  const phone = res.items.find(i => i.objectType === 'phone');

  assert(!!lamp, 'Lamp must be in scene');
  assert(!!headphones, 'Headphones must be in scene');
  assert(!!phone, 'Phone must be in scene');

  // Verify Lamp is pushed to upper-left background
  assert(lamp!.state === 'bg', 'Lamp should be background monochrome');
  assert(lamp!.x >= 150 && lamp!.x <= 200, `Lamp x=${lamp!.x} should be in upper-left (150..200)`);
  assert(lamp!.y >= 140 && lamp!.y <= 200, `Lamp y=${lamp!.y} should be in upper-left (140..200)`);

  // Verify Headphones is in upper-right / midground-right
  assert(headphones!.state === 'main', 'Headphones should be main color');
  assert(headphones!.x >= 650 && headphones!.x <= 720, `Headphones x=${headphones!.x} should be in midground-right (650..720)`);
  assert(headphones!.y >= 480 && headphones!.y <= 540, `Headphones y=${headphones!.y} should be near midground (480..540)`);

  // Verify Phone is in lower-left foreground
  assert(phone!.state === 'main', 'Phone should be main color');
  assert(phone!.x >= 300 && phone!.x <= 370, `Phone x=${phone!.x} should be in lower-left (300..370)`);
  assert(phone!.y >= 780 && phone!.y <= 840, `Phone y=${phone!.y} should be in foreground (780..840)`);

  // Verify Anti-Clumping Negative Space: Phone and Headphones must be spaced far apart (> 400px)
  const dist = Math.hypot(phone!.x - headphones!.x, phone!.y - headphones!.y);
  assert(dist > 400, `Phone and Headphones must have breathing room (>400px), got ${dist.toFixed(1)}px`);

  // Also verify manual component selection with 3 items gives identical harmonious layout
  const resManual = generateCompositionFromComponents(['headphones', 'lamp', 'phone'], '1:1', 'L');
  const mPhone = resManual.find(i => i.objectType === 'phone')!;
  const mHeadphones = resManual.find(i => i.objectType === 'headphones')!;
  const manualDist = Math.hypot(mPhone.x - mHeadphones.x, mPhone.y - mHeadphones.y);
  assert(manualDist > 400, `Manual selection must also avoid clumping (>400px), got ${manualDist.toFixed(1)}px`);

  console.log('  ✓ User Reference Image 2 layout verified with >400px negative space between items');
}

// 12. Test Palette-Specific Bespoke Background Decors
{
  console.log('Test 12: Palette-Specific Bespoke Background Decors');

  // 12a. Purple Mist (Classic Studio Ochen): soft diagonal scratches, soft shadow ellipse, white pill
  const purpleDecor = getBackgroundDecorSVG(1000, 1000, DEFAULT_PALETTES.purple);
  assert(purpleDecor.includes('stroke="#7764d6"'), 'Purple decor must use purple dark stroke');
  assert(purpleDecor.includes('fill="#ffffff"'), 'Purple decor must contain crisp white pill');
  assert(purpleDecor.includes('opacity="0.12"'), 'Purple decor must contain soft shadow ellipse');

  // 12b. Warm Peach: concentric accent ring, circle dot, 30° drafting hatch marks, terracotta/cream pills
  const peachDecor = getBackgroundDecorSVG(1000, 1000, DEFAULT_PALETTES.peach);
  assert(peachDecor.includes('stroke="#d17431"'), 'Peach decor must use terracotta dark stroke');
  assert(peachDecor.includes('<ellipse') && peachDecor.includes('fill="none"'), 'Peach decor must include geometric ring');
  assert(peachDecor.includes('<circle') && peachDecor.includes('r="3"'), 'Peach decor must include concentric dot');
  assert(peachDecor.includes('fill="#f9ebaf"'), 'Peach decor must include warm cream pill');

  // 12c. Fresh Mint: dotted isometric coordinate axis, technical crosshairs, subtle tech grid accents, cyan/mint pills
  const mintDecor = getBackgroundDecorSVG(1000, 1000, DEFAULT_PALETTES.mint);
  assert(mintDecor.includes('stroke="#59bdbd"'), 'Mint decor must use mint dark stroke');
  assert(mintDecor.includes('stroke-dasharray="4 6"'), 'Mint decor must include dotted coordinate axis');
  assert(mintDecor.includes('stroke-dasharray="3 5"'), 'Mint decor must include secondary guide axis');
  assert(mintDecor.includes('stroke-dasharray="2 6"'), 'Mint decor must include subtle tech grid accents');
  assert(mintDecor.includes('fill="#e4f7f7"'), 'Mint decor must include cyan/mint pill');

  // 12d. Verify Standalone SVG Exporter embeds the palette-specific decor
  const mockItems = generateCompositionFromPrompt('Подкасты и медиа', '1:1', 'L').items;
  const svgOutput = buildStandaloneSVG(mockItems, '1:1', DEFAULT_PALETTES.mint, {}, true);
  assert(svgOutput.includes('stroke-dasharray="4 6"'), 'Exported SVG for mint must contain dotted coordinate axis');
  assert(svgOutput.includes('stroke-dasharray="2 6"'), 'Exported SVG for mint must contain subtle tech grid accents');
  assert(svgOutput.includes('fill="#e4f7f7"'), 'Exported SVG for mint must contain cyan/mint pill');

  const svgPeach = buildStandaloneSVG(mockItems, '1:1', DEFAULT_PALETTES.peach, {}, true);
  assert(svgPeach.includes('fill="none"'), 'Exported SVG for peach must contain geometric accent ring');
  assert(svgPeach.includes('fill="#f9ebaf"'), 'Exported SVG for peach must contain warm cream pill');

  console.log('  ✓ Bespoke background decors verified for all 3 official palettes in canvas and SVG export');
}

// 13. Test Anti-Clumping across Mobile Apps and Wallet Scenarios
{
  console.log('Test 13: Scenario 9 (Mobile Apps) Anti-Clumping & Wallet Spacing');

  // Scenario 9: Phone + Headphones + Puzzle
  const s9 = generateCompositionFromPrompt('Мобильные приложения и сервисы', '1:1', 'L');
  assert(s9.items.length === 3, `Expected 3 items in Mobile Apps scene, got ${s9.items.length}`);
  const s9Phone = s9.items.find(i => i.objectType === 'phone')!;
  const s9Headphones = s9.items.find(i => i.objectType === 'headphones')!;
  const s9Puzzle = s9.items.find(i => i.objectType === 'puzzle')!;

  assert(!!s9Phone && !!s9Headphones && !!s9Puzzle, 'All 3 items must be in Mobile Apps');
  const distPhoneHeadphones = Math.hypot(s9Phone.x - s9Headphones.x, s9Phone.y - s9Headphones.y);
  assert(distPhoneHeadphones > 400, `Phone and Headphones in Scenario 9 must be spaced (>400px), got ${distPhoneHeadphones.toFixed(1)}px`);

  const distPuzzleHeadphones = Math.hypot(s9Puzzle.x - s9Headphones.x, s9Puzzle.y - s9Headphones.y);
  assert(distPuzzleHeadphones > 400, `Puzzle and Headphones in Scenario 9 must be spaced (>400px), got ${distPuzzleHeadphones.toFixed(1)}px`);

  // Scenario 6: Wallet + Puzzle + Coin - Coin must not collide with wallet clasp
  const s6 = generateCompositionFromPrompt('Кибербезопасность и защита данных', '1:1', 'L');
  const s6Wallet = s6.items.find(i => i.objectType === 'wallet')!;
  const s6Coin = s6.items.find(i => i.objectType === 'coin')!;
  assert(s6Coin.y >= 700, `Coin in Scenario 6 y=${s6Coin.y} should be in foreground below wallet clasp (>=700)`);
  const distWalletCoin = Math.hypot(s6Wallet.x - s6Coin.x, s6Wallet.y - s6Coin.y);
  assert(distWalletCoin > 200, `Coin and wallet clasp must not collide, got ${distWalletCoin.toFixed(1)}px`);

  console.log('  ✓ Anti-clumping and collision-free spacing verified for Scenario 9 and Scenario 6');
}

// 14. Test Strict Item Count & No Phantom Objects in Manual Component Selections
{
  console.log('Test 14: Strict Item Count (No Phantom Objects in 2-Item Selections)');

  // 14a. Headphones + Phone must return EXACTLY 2 items (no phantom flowers)
  const hpRes = generateCompositionFromComponents(['headphones', 'phone'], '1:1', 'L');
  assert(hpRes.length === 2, `Expected exactly 2 items for [headphones, phone], got ${hpRes.length}`);
  assert(!hpRes.some(i => i.objectType === 'flowers'), 'Must not inject phantom flowers into [headphones, phone]');

  const phRes = generateCompositionFromComponents(['phone', 'headphones'], '1:1', 'L');
  assert(phRes.length === 2, `Expected exactly 2 items for [phone, headphones], got ${phRes.length}`);
  assert(!phRes.some(i => i.objectType === 'flowers'), 'Must not inject phantom flowers into [phone, headphones]');

  // 14b. Notebook + Lamp must return EXACTLY 2 items (no phantom pen)
  const nlRes = generateCompositionFromComponents(['notebook', 'lamp'], '1:1', 'L');
  assert(nlRes.length === 2, `Expected exactly 2 items for [notebook, lamp], got ${nlRes.length}`);
  assert(!nlRes.some(i => i.objectType === 'pen'), 'Must not inject phantom pen into [notebook, lamp]');

  // 14c. Wallet + Lamp must return EXACTLY 2 items (no phantom coin)
  const wlRes = generateCompositionFromComponents(['wallet', 'lamp'], '1:1', 'L');
  assert(wlRes.length === 2, `Expected exactly 2 items for [wallet, lamp], got ${wlRes.length}`);
  assert(!wlRes.some(i => i.objectType === 'coin'), 'Must not inject phantom coin into [wallet, lamp]');

  console.log('  ✓ Strict 2-item component selections verified with 0 phantom objects');
}

console.log('--- All tests passed with 100% success! ---');
