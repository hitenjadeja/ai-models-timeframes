const byId = id => document.getElementById(id);
const mainLabs = ['openai', 'anthropic', 'google', 'meta', 'deepseek', 'alibaba', 'xai', 'mistral'];
const customLabs = new Set(mainLabs);
const regions = {
    openai: 'US', anthropic: 'US', google: 'US', meta: 'US', xai: 'US', microsoft: 'US', amazon: 'US',
    deepseek: 'China', alibaba: 'China', moonshot: 'China', zhipu: 'China', minimax: 'China',
    bytedance: 'China', mistral: 'France', cohere: 'Canada'
};
const labNames = Object.fromEntries(groups.map(group => [group.id, group.content]));
const dots = {openai:'#39876c', anthropic:'#bb785b', google:'#4478c0', meta:'#3766bc',
    xai:'#232e29', deepseek:'#5269cb', alibaba:'#ce752f', mistral:'#d7952d'};
const releases = [...allItems].sort((a,b) => b.start.localeCompare(a.start) || a.id-b.id);
const monthKey = date => date.toISOString().slice(0,7);
const format = (date, options) => new Date(date).toLocaleDateString('en-US', {...options,timeZone:'UTC'});
const monthLabel = key => format(key+'-01', {month:'long', year:'numeric'});
const months = [];
const first = releases[releases.length-1].start.slice(0,7);
for (let date = new Date(releases[0].start.slice(0,7)+'-01'); monthKey(date)>=first; date.setUTCMonth(date.getUTCMonth()-1)) {
    months.push(monthKey(date));
}
function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}
function regionOf(item) {
    if (regions[item.group]) return regions[item.group];
    const developer = item.title.split(' - ').at(-1).split('\n')[0];
    if (/Tencent|StepFun|Xiaomi|Baidu|InclusionAI|Huawei|Meituan|Kuaishou|Ant Group|OpenBMB|Zhipu|Robbyant|ModelBest/i.test(developer)) return 'China';
    if (/NVIDIA|IBM|AMD\b|Allen Institute|Databricks|Liquid AI|Inception Labs|Ai2|Arcee AI|Thinking Machines Lab|Zyphra/i.test(developer)) return 'US';
    return '';
}
function matches(item) {
    const scope = byId('provider').value;
    const providerMatch = scope === 'main' ? mainLabs.includes(item.group) : scope === 'custom' ? customLabs.has(item.group) : scope === 'all' || scope === item.group;
    return providerMatch && (byId('region').value === 'all' || regionOf(item) === byId('region').value)
        && (byId('access').value === 'all' || (byId('access').value === 'source' && item.openLicense) || (item.access || 'unknown') === byId('access').value);
}
function releaseRow(item) {
    const row = element('details','release');
    const summary = element('summary','row');
    const date = element('time','',format(item.start,{month:'short',day:'2-digit'}));
    date.dateTime = item.start;
    const lab = element('span','lab');
    const dot = element('i','');
    if (dots[item.group]) dot.style.setProperty('--dot',dots[item.group]);
    lab.append(dot,labNames[item.group]);
    summary.append(date,element('strong','name',item.content),lab);
    const detail = element('div','detail',item.title.split('\n')[0]);
    const access = {open:'Open weights',closed:'Closed weights',unknown:'Access unspecified'};
    detail.append(element('p','access',[access[item.access] || access.unknown,regionOf(item)].filter(Boolean).join(' · ')));
    row.append(summary, detail);
    return row;
}
function chooseMonth(key) {
    byId('month').value = key;
    render();
}
function render() {
    const key = byId('month').value;
    const index = months.indexOf(key);
    const matching = releases.filter(matches);
    const visible = matching.filter(item => item.start.startsWith(key));
    byId('period').textContent = monthLabel(key);
    byId('count').textContent = visible.length+' matching release'+(visible.length===1?'':'s');
    byId('custom-labs').hidden = byId('provider').value !== 'custom';
    byId('scope-note').textContent = byId('provider').value==='main' ? mainLabs.map(id=>labNames[id]).join(', ') : '';
    byId('prev').disabled = index===months.length-1;
    byId('next').disabled = index===0;
    const list = byId('list');
    list.replaceChildren(...visible.map(releaseRow));
    if (!visible.length) list.append(element('p','empty','No releases match this month. Choose another month or adjust your filters.'));
    const windowMonths = months.slice(index,index+12).reverse();
    const counts = windowMonths.map(month => matching.filter(item=>item.start.startsWith(month)).length);
    const peak = Math.max(1,...counts);
    byId('axis-start').textContent = monthLabel(windowMonths[0]);
    byId('axis-end').textContent = monthLabel(key);
    document.querySelector('.chart-label span').textContent = windowMonths.length+' month'+(windowMonths.length===1?'':'s');
    byId('bars').replaceChildren(...windowMonths.map((month,i) => {
        const button = element('button','bar');
        button.title = monthLabel(month)+' · '+counts[i]+' release'+(counts[i]===1?'':'s');
        button.setAttribute('aria-label',button.title);
        button.setAttribute('aria-current',String(month===key));
        const bar = element('i','');
        bar.style.height = Math.max(3,counts[i]/peak*100)+'%';
        button.append(bar);
        button.onclick = () => {chooseMonth(month); byId('bars').lastElementChild.focus();};
        return button;
    }));
}
groups.forEach(group => {
    byId('provider').add(new Option(group.content,group.id));
    const label = element('label','lab-check');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = customLabs.has(group.id);
    checkbox.onchange = () => {
        if (checkbox.checked) customLabs.add(group.id);
        else customLabs.delete(group.id);
        render();
    };
    label.append(checkbox,group.content);
    byId('custom-labs').append(label);
});
months.forEach(month=>byId('month').add(new Option(monthLabel(month),month)));
byId('model-count').textContent = releases.length;
document.querySelectorAll('select').forEach(select=>select.addEventListener('change',render));
byId('prev').onclick = () => chooseMonth(months[months.indexOf(byId('month').value)+1]);
byId('next').onclick = () => chooseMonth(months[months.indexOf(byId('month').value)-1]);
byId('reset').onclick = () => {
    byId('provider').value = 'main';
    document.querySelectorAll('.lab-check input').forEach((box,i) => {
        box.checked = mainLabs.includes(groups[i].id);
        if (box.checked) customLabs.add(groups[i].id);
        else customLabs.delete(groups[i].id);
    });
    byId('access').value = byId('region').value = 'all';
    render();
};
render();
