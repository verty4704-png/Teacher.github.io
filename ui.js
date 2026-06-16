
export function save(state){localStorage.setItem('teacher_state',JSON.stringify(state));}
export function load(){return JSON.parse(localStorage.getItem('teacher_state')||'{}');}
