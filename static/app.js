async function editMemo(event) {
  const id = event.target.dataset.id;
  const editInput = prompt("수정할 값을 입력하세요");
  const res = await fetch(`/memos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      content: editInput,
    }),
  });
  readMemo();
}

async function deleteMemo(event) {
  const id = event.target.dataset.id;
  const res = await fetch(`/memos/${id}`, {
    method: "DELETE",
  });
  readMemo();
}

function displayMemo(memo) {
  const ul = document.querySelector("#memo_ul");

  const li = document.createElement("li");
  li.innerText = `[id:${memo.id}]${memo.content}`;

  const editBtn = document.createElement("button");
  editBtn.innerText = "수정하기!";
  editBtn.addEventListener("click", editMemo);
  editBtn.dataset.id = memo.id;

  const delBtn = document.createElement("button");
  delBtn.innerText = "삭제";
  delBtn.addEventListener("click", deleteMemo);
  delBtn.dataset.id = memo.id;

  li.appendChild(editBtn);
  li.appendChild(delBtn);
  ul.appendChild(li);
}

async function readMemo() {
  const sortedSelect = document.querySelector("#sorted-select");
  let sort_by, order;
  switch (sortedSelect.value) {
    case "ASC":
      sort_by = "content";
      order = "asc";
      break;
    case "DESC":
      sort_by = "content";
      order = "desc";
      break;
    case "TIME":
      sort_by = "id";
      order = "desc";
      break;
  }
  const res = await fetch(`/memos?sort_by=${sort_by}&order=${order}`);
  const jsonRes = await res.json();
  const ul = document.querySelector("#memo_ul");
  ul.innerHTML = " ";
  jsonRes.forEach(displayMemo);
}

readMemo();

async function createMemo(value) {
  const res = await fetch("/memos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date().getTime(),
      content: value,
    }),
  });
  readMemo();
}

function handleSubmit(event) {
  event.preventDefault();
  const input = document.querySelector("#memo-input");
  createMemo(input.value);
  input.value = " ";
}

const form = document.querySelector("#memo-form");
document.querySelector("#sorted-select").addEventListener("change", readMemo);
form.addEventListener("submit", handleSubmit);

readMemo();