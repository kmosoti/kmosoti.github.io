/* Deterministic, explanatory trace. Not captured telemetry. All quantities are bytes. */
(() => {
  'use strict';
  const CAPACITY = 64 * 1024;
  const traces = {
    original: [
      {written:0,read:0,child:'Ready',parent:'Ready',message:'Child process created; the pipe is empty.'},
      {written:0,read:0,child:'Running',parent:'Waiting',message:'Parent invokes wait() without concurrently draining the child pipes.'},
      {written:48*1024,read:0,child:'Running',parent:'Waiting',message:'Child writes 48 KiB; parent remains blocked in wait().'},
      {written:64*1024,read:0,child:'Running',parent:'Waiting',message:'Child writes another 16 KiB. The 64 KiB pipe is full.'},
      {written:64*1024,read:0,child:'Blocked write()',parent:'Waiting',message:'Child attempts another 8 KiB. Blocking write() cannot complete; wait() cannot return.'}
    ],
    corrected: [
      {written:0,read:0,child:'Ready',parent:'Monitoring',message:'Child created with a concurrent stdout/stderr drainer.'},
      {written:48*1024,read:0,child:'Running',parent:'Draining',message:'Child writes 48 KiB; reader is available.'},
      {written:48*1024,read:32*1024,child:'Running',parent:'Draining',message:'Concurrent drainer reads 32 KiB, freeing capacity.'},
      {written:80*1024,read:32*1024,child:'Running',parent:'Draining',message:'Child writes another 32 KiB; total accepted output is 80 KiB.'},
      {written:80*1024,read:80*1024,child:'Exited',parent:'Reaping',message:'Drainer consumes remaining 48 KiB. Child exits.'},
      {written:80*1024,read:80*1024,child:'Exited',parent:'Completed',message:'Parent reaps the child; pipe occupancy is zero.'}
    ]
  };
  let mode='original';
  let currentStep=0;
  const $ = id => document.getElementById(id);
  const original = $('mode-original');
  const corrected = $('mode-corrected');
  const next = $('next-trace');
  const reset = $('reset-trace');
  if (!original || !corrected || !next || !reset) return;
  function render() {
    const rows = traces[mode];
    const s = rows[currentStep];
    const occupancy=s.written-s.read;
    if(occupancy<0 || occupancy>CAPACITY) throw new Error('Pipe capacity invariant violated');
    $('pipe-amount').textContent = `${occupancy/1024} / 64 KiB`;
    $('pipe-fill').style.width = `${occupancy/CAPACITY*100}%`;
    $('pipe-state').textContent = occupancy===CAPACITY?'Full':occupancy===0?'Empty':'Accepting writes';
    $('child-state').textContent = s.child;
    $('parent-state').textContent = s.parent;
    $('step-number').textContent = `${currentStep} / ${rows.length-1}`;
    $('step-desc').textContent = s.message;
    $('event-log').replaceChildren(...rows.slice(0,currentStep+1).map(r=>{const li=document.createElement('li');li.textContent=r.message;return li;}));
    next.disabled=currentStep===rows.length-1;
    next.textContent=currentStep===rows.length-1?'Trace complete':'Next transition →';
    original.classList.toggle('is-selected',mode==='original');
    corrected.classList.toggle('is-selected',mode==='corrected');
    original.setAttribute('aria-pressed',String(mode==='original'));
    corrected.setAttribute('aria-pressed',String(mode==='corrected'));
  }
  original.addEventListener('click',()=>{mode='original';currentStep=0;render()});
  corrected.addEventListener('click',()=>{mode='corrected';currentStep=0;render()});
  next.addEventListener('click',()=>{if(currentStep<traces[mode].length-1){currentStep++;render()}});
  reset.addEventListener('click',()=>{currentStep=0;render()});
  render();
})();