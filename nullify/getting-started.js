// Getting-started additions by Codex (GPT-6 AI agent), at Kayla's request.
// All choices stay in the same disposable, in-memory workspace as the original app.
(() => {
  const starters = {
    categories: [
      {name:'Work',color:'#7c6cff'}, {name:'Personal',color:'#00d4a0'},
      {name:'Errands',color:'#ffb454'}, {name:'Someday / Maybe',color:'#ff6ec7'},
    ],
    labels: [
      {name:'#low-energy',color:'#00d4a0'}, {name:'#waiting-on',color:'#ffb454'},
      {name:'#quick-win',color:'#7c6cff'}, {name:'#important',color:'#ff6ec7'},
    ],
    systems: [
      {name:'Weekly reset',method:'GTD (Getting Things Done)',cadence:'Weekly',detail:'A weekly appointment to admire everything you captured.'},
      {name:'A little room for everything',method:'PARA',cadence:'Monthly',detail:'Projects, areas, resources and a very patient archive.'},
    ],
    workflows: [
      {name:'A gentle start',steps:['Collect loose thoughts','Choose one small thing','Make a very promising list'],detail:'Three steps toward the sensation of a fresh start.'},
      {name:'Close the tabs',steps:['Review the day','Move the leftovers to tomorrow','Admire the clean slate'],detail:'A closing ritual for an extremely open-ended day.'},
    ],
  };
  const picked = new Set();
  const custom = {categories:'',labels:''};
  let step = 0;
  const titles = ['Welcome to your fresh start','Make a little room','Give things a label','Find your rhythm','Your workspace, at a glance'];
  const descriptions = [
    'A few choices, a little structure, a brand-new you. Choose only the starters you want. You can edit them later, or skip setup entirely.',
    'Categories are the big buckets. Pick a few, add your own, or leave the shelves empty.',
    'Labels travel across categories. Choose the ones that sound useful. A taxonomy is a personal thing.',
    'A system is a method with a review date. A workflow is a list of steps with excellent branding. Both are optional.',
    'Here is exactly what will be added. Nothing enters your workspace until you finish.',
  ];
  const banner = document.createElement('section');
  banner.className = 'setup-banner';
  banner.setAttribute('aria-label','Getting started');
  banner.innerHTML = '<div><h3>A place for everything. Shall we begin?</h3><p>Take a quick walkthrough and choose a few optional starters.</p></div><button class="btn primary" id="open-setup" type="button">Get started</button>';
  document.querySelector('#view-dashboard .topbar').after(banner);
  const dialog = document.createElement('dialog');
  dialog.className = 'setup-dialog';
  dialog.setAttribute('aria-labelledby','setup-title');
  document.body.append(dialog);

  function selections() {
    const items = [];
    for (const [kind, templates] of Object.entries(starters)) {
      templates.forEach((item,index) => { if (picked.has(`${kind}:${index}`)) items.push({kind,item}); });
    }
    for (const kind of ['categories','labels']) {
      let name = custom[kind].trim();
      if (kind === 'labels' && name && !name.startsWith('#')) name = '#' + name.replace(/\s+/g,'-').toLowerCase();
      if (name) items.push({kind,item:{name,color:kind === 'categories' ? '#7c6cff' : '#00d4a0'}});
    }
    const seen = new Set();
    return items.filter(({kind,item}) => {
      const key = `${kind}:${item.name.toLowerCase()}`;
      if (seen.has(key) || state[kind].some(existing => existing.name.toLowerCase() === item.name.toLowerCase())) return false;
      seen.add(key); return true;
    });
  }
  function choices(kind) {
    return '<div class="setup-options">' + starters[kind].map((item,index) => {
      const key = `${kind}:${index}`;
      return `<label class="setup-option"><input type="checkbox" data-choice="${key}" ${picked.has(key) ? 'checked' : ''}><span>${esc(item.name)}${item.detail ? `<small>${esc(item.detail)}</small>` : ''}</span></label>`;
    }).join('') + '</div>';
  }
  function saveDraft() {
    dialog.querySelectorAll('[data-choice]').forEach(input => input.checked ? picked.add(input.dataset.choice) : picked.delete(input.dataset.choice));
    const input = dialog.querySelector('[data-custom]');
    if (input) custom[input.dataset.custom] = input.value;
  }
  function renderStep() {
    let content = '';
    const hasWorkspace = Object.keys(starters).some(kind => state[kind].length > 0);
    if (step === 0) content = '<p>Start with categories, add a few labels, then choose a system or workflow. No account, no complicated decisions. Remarkable potential.</p><p>Like everything in Nullify, this workspace lasts until you refresh. Fresh starts are our specialty.</p>';
    if (step === 1 || step === 2) {
      const kind = step === 1 ? 'categories' : 'labels';
      content = choices(kind) + `<div class="field"><label for="setup-custom">Or add your own ${step === 1 ? 'category' : 'label'} (optional)</label><input id="setup-custom" data-custom="${kind}" type="text" maxlength="80" value="${esc(custom[kind])}" placeholder="${step === 1 ? 'e.g. Side quests' : 'e.g. #future-me'}"></div>`;
    }
    if (step === 3) content = '<h3>Systems</h3>' + choices('systems') + '<h3>Workflows</h3>' + choices('workflows');
    if (step === 4) {
      const items = selections();
      content = items.length ? '<ul class="setup-summary">' + items.map(({kind,item}) => `<li>${esc(item.name)} <span style="color:var(--muted)">· ${esc(kind)}</span></li>`).join('') + '</ul><p>Already-created starters are left alone. The rest will be added together.</p>' : `<p>${hasWorkspace ? 'No new starters selected. Your current workspace will stay as it is.' : 'No new starters selected. A beautifully blank workspace is an entirely valid system.'}</p>`;
    }
    dialog.innerHTML = `<div class="setup-shell"><ol class="setup-progress" aria-label="Step ${step + 1} of 5">${titles.map((_,i) => `<li class="${i <= step ? 'done' : ''}"></li>`).join('')}</ol><span class="setup-kicker">Getting started · ${step + 1} of 5</span><h2 id="setup-title" tabindex="-1">${titles[step]}</h2><p>${descriptions[step]}</p>${content}<div class="setup-actions"><button class="btn setup-skip" type="button" data-action="skip">Skip for now</button>${step ? '<button class="btn" type="button" data-action="back">Back</button>' : ''}<button class="btn primary" type="button" data-action="next">${step === 4 ? (selections().length ? 'Create my workspace' : hasWorkspace ? 'Keep my workspace' : 'Start with a blank workspace') : step === 0 ? 'Let’s set things up' : 'Continue'}</button></div><div class="setup-credit">Walkthrough by Codex (GPT-6 AI agent). Original Nullify by Claude.</div></div>`;
    dialog.querySelector('#setup-title').focus();
  }
  function openSetup() { step = 0; renderStep(); dialog.showModal(); }
  document.getElementById('open-setup').addEventListener('click',openSetup);
  dialog.addEventListener('click',event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    saveDraft();
    if (action === 'skip') { dialog.close(); return; }
    if (action === 'back') { step--; renderStep(); return; }
    if (step < 4) { step++; renderStep(); return; }
    const items = selections();
    for (const {kind,item} of items) state[kind].push({...item,...(item.steps ? {steps:[...item.steps]} : {})});
    renderAll();
    if (items.length) { bump(.25); logActivity('✨','Set up workspace',`${items.length} chosen starters`); }
    renderMetrics();
    dialog.close(); go('dashboard');
    toast('Your workspace is ready.',items.length ? `${items.length} starters. So much potential.` : 'Nothing added. Everything is just as you left it.');
    banner.querySelector('h3').textContent = 'Your workspace, your way.';
    document.getElementById('open-setup').textContent = 'Revisit setup';
  });
  dialog.addEventListener('close',() => document.getElementById('open-setup').focus());

  // Starter menus only fill drafts. The original Create/Establish/Activate buttons commit them.
  for (const [kind,prefix] of [['categories','cat'],['labels','lab'],['systems','sys'],['workflows','wf']]) {
    const field = document.getElementById(`${prefix}-name`).closest('.field');
    const picker = document.createElement('div');
    picker.className = 'field starter-pick';
    picker.innerHTML = `<label for="${prefix}-starter">Optional starter</label><select id="${prefix}-starter"><option value="">Choose a starter…</option>${starters[kind].map((item,index) => `<option value="${index}">${esc(item.name)}</option>`).join('')}</select><small>Fills the draft only. Edit it, then create it when you’re ready.</small>`;
    field.before(picker);
    picker.querySelector('select').addEventListener('change',event => {
      if (event.target.value === '') return;
      const item = starters[kind][Number(event.target.value)];
      document.getElementById(`${prefix}-name`).value = item.name;
      if (kind === 'categories' || kind === 'labels') {
        state[kind === 'categories' ? 'catColor' : 'labColor'] = item.color;
        buildSwatches(`${prefix}-swatches`,kind === 'categories' ? 'catColor' : 'labColor');
      }
      if (kind === 'systems') { document.getElementById('sys-method').value = item.method; document.getElementById('sys-cadence').value = item.cadence; }
      if (kind === 'workflows') { state.draftSteps = [...item.steps]; renderDraftSteps(); }
      event.target.value = '';
      document.getElementById(`${prefix}-name`).focus();
    });
  }
  openSetup();
})();
