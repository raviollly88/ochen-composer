import {
  generateCompositionFromPrompt,
  generateCompositionFromComponents,
  fitAndCenterScene,
  PRESET_THEMES,
} from './aiComposer';
import type { CanvasFormat } from './types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('--- Running Studio Ochen AI Composer Test Suite ---');

// 1. Test Preset Theme 1: Journalism & Writing (User Reference Layout)
{
  console.log('Test 1: Journalism & Writing (User Image 3 layout)');
  const res = generateCompositionFromPrompt(PRESET_THEMES[0].prompt, '1:1', 'L');
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

// 2. Test Preset Theme 2: Finance & Budget (Studio Card 5 - No Lamp Base Overlap)
{
  console.log('Test 2: Finance & Budget (Studio Card 5)');
  const res = generateCompositionFromPrompt(PRESET_THEMES[1].prompt, '1:1', 'L');
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

  // Verify no overlap: wallet must be clear of lamp base and shadow
  assert(wallet!.y > lamp!.y + 400, 'Wallet must be placed below lamp base');
  assert(coin!.x > wallet!.x + 150, 'Coin must be placed to the right of wallet along 30 deg axis');
  console.log('  ✓ Finance & Budget Card 5 layout passed without lamp base collision');
}

// 3. Test Preset Theme 3: Productivity (Studio Card 2 - Notebook + Phone)
{
  console.log('Test 3: Productivity (Studio Card 2)');
  const res = generateCompositionFromPrompt(PRESET_THEMES[2].prompt, '1:1', 'L');
  const notebook = res.items.find(i => i.objectType === 'notebook');
  const phone = res.items.find(i => i.objectType === 'phone');
  
  assert(!!notebook, 'Notebook must be in Productivity scene');
  assert(!!phone, 'Phone must be in Productivity scene');
  assert(phone!.zIndex > notebook!.zIndex, 'Phone must rest on top of notebook');
  assert(phone!.scale < notebook!.scale, 'Phone scale must fit on notebook page');
  console.log('  ✓ Productivity Card 2 layout passed');
}

// 4. Test Preset Theme 4: Music (Studio Card 4 - Flowers + Headphones)
{
  console.log('Test 4: Music & Relaxation (Studio Card 4)');
  const res = generateCompositionFromPrompt(PRESET_THEMES[3].prompt, '1:1', 'L');
  const flowers = res.items.find(i => i.objectType === 'flowers');
  const headphones = res.items.find(i => i.objectType === 'headphones');
  
  assert(!!flowers, 'Flowers must be in Music scene');
  assert(!!headphones, 'Headphones must be in Music scene');
  assert(flowers!.state === 'bg', 'Flowers should be bg monochrome');
  assert(headphones!.state === 'main', 'Headphones should be main color');
  assert(headphones!.zIndex > flowers!.zIndex, 'Headphones must be foreground');
  console.log('  ✓ Music Card 4 layout passed');
}

// 5. Test Preset Theme 5: IT-Startup (Studio Card 1 - Phone + Puzzle)
{
  console.log('Test 5: IT-Startup (Studio Card 1)');
  const res = generateCompositionFromPrompt(PRESET_THEMES[4].prompt, '1:1', 'L');
  const phone = res.items.find(i => i.objectType === 'phone');
  const puzzle = res.items.find(i => i.objectType === 'puzzle');
  
  assert(!!phone, 'Phone must be in IT-Startup scene');
  assert(!!puzzle, 'Puzzle must be in IT-Startup scene');
  assert(phone!.x < puzzle!.x, 'Phone must be lower-left from puzzle');
  assert(phone!.y > puzzle!.y, 'Phone must be lower-left from puzzle');
  console.log('  ✓ IT-Startup Card 1 layout passed');
}

// 6. Test Preset Theme 6: Workspace (Folder + Pen + Lamp)
{
  console.log('Test 6: Workspace & Documents');
  const res = generateCompositionFromPrompt(PRESET_THEMES[5].prompt, '1:1', 'L');
  const folder = res.items.find(i => i.objectType === 'folder');
  const pen = res.items.find(i => i.objectType === 'pen');
  const lamp = res.items.find(i => i.objectType === 'lamp');
  
  assert(!!folder, 'Folder must be in Workspace scene');
  assert(!!pen, 'Pen must be in Workspace scene');
  assert(!!lamp, 'Lamp must be in Workspace scene');
  assert(pen!.x > lamp!.x + 180, 'Pen must be clear of lamp base to avoid collision');
  assert(folder!.x > pen!.x, 'Folder should be upper-right and pen in foreground-center');
  console.log('  ✓ Workspace layout passed');
}

// 7. Test All Formats (16:9, 9:16, 4:3, 1:1)
{
  console.log('Test 7: All canvas formats');
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

// 8. Test Edge Cases: Empty Prompt, Gibberish, Single Object
{
  console.log('Test 8: Edge cases');
  // Empty prompt
  const resEmpty = generateCompositionFromPrompt('', '1:1', 'L');
  assert(resEmpty.items.length >= 2, 'Empty prompt must produce a balanced default scene');
  
  // Gibberish prompt
  const resGibberish = generateCompositionFromPrompt('qwerty asdfgh zxcvbn', '1:1', 'L');
  assert(resGibberish.items.length >= 2, 'Gibberish prompt must produce a fallback scene');

  // Scenario 2: Component selection
  const res1 = generateCompositionFromComponents(['lamp'], '1:1', 'L');
  assert(res1.length >= 2, 'Single component selection should auto-pair companions');

  const res2 = generateCompositionFromComponents(['phone', 'puzzle'], '1:1', 'L');
  assert(res2.length === 2, 'Two components should create clean pair');

  const res3 = generateCompositionFromComponents(['notebook', 'lamp', 'pen'], '1:1', 'L');
  assert(res3.length === 3, 'Three components should place all three');

  // Format transition with fitAndCenterScene
  const centered = fitAndCenterScene(res3, '16:9');
  assert(centered.length === 3, 'fitAndCenterScene should preserve items count');
  console.log('  ✓ Edge cases verified successfully');
}

console.log('All tests passed with 100% success!');
