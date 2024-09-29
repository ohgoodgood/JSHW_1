// 상품 정보
function product(name, price) {
  this.name = name;
  this.price = price;
}

let products = [
  new product("대뱃살", 3000),
  new product("목살", 5000),
  new product("배꼽살", 4000),
  new product("중뱃살", 1000),
];

// 상품을 select에 추가
let productSelect = document.getElementById("productSelect");
products.forEach((product, index) => {
  let option = document.createElement("option");
  option.value = index; // 제품 인덱스를 저장
  option.text = `${product.name} - ${product.price}원`;
  productSelect.appendChild(option);
});

let selectedproducts = [];
let totalPrice = 0;

// 상품 선택 시 이벤트 핸들러
productSelect.addEventListener("change", function () {
  let selectedOptions = Array.from(productSelect.selectedOptions);

  // 현재 선택한 옵션을 중복해서 추가하도록 설정
  selectedOptions.forEach((option) => {
    let selectedproduct = products[option.value];
    selectedproducts.push(selectedproduct); // 중복 추가 허용
    totalPrice += selectedproduct.price;
  });
  updateSelectedproducts();
});

// 선택한 상품 목록과 총액 업데이트
function updateSelectedproducts() {
  let productList = document.getElementById("productList");
  let totalPriceElement = document.getElementById("totalPrice");
  productList.innerHTML = "";
  selectedproducts.forEach((product) => {
    let li = document.createElement("li");
    li.textContent = `${product.name} - ${product.price}원`;
    productList.appendChild(li);
  });
  totalPriceElement.textContent = `총액: ${totalPrice}원`;
}

// 결제 후 페이지 초기화 함수
function resetPage() {
  productSelect.selectedIndex = -1; // 상품 선택 초기화
  selectedproducts = []; // 선택한 상품 배열 초기화
  totalPrice = 0; // 총액 초기화
  updateSelectedproducts(); // UI 업데이트
}

// 결제하기 버튼 클릭 이벤트
document.getElementById("paymentButton").addEventListener("click", function () {
  if (selectedproducts.length === 0) {
    alert("결제할 상품을 선택해야 합니다.");
    return;
  }

  let newWindow = window.open("", "payment", "width=400,height=300");
  newWindow.document.write(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif; /* 판매 페이지와 동일한 폰트 적용 */
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <h1>결제창</h1>
        <p>${totalPrice}원을 결제하겠습니다</p>
        <label for="cardNumber">신용카드 번호를 입력하고 결제 버튼을 눌러 주세요</label><br>
        <input id="cardNumber" type="text"><br><br>
        <button id="payNowButton">결제</button>
        <script>
          document.getElementById("payNowButton").addEventListener("click", function () {
            let cardNumber = document.getElementById("cardNumber").value;
            if (cardNumber) {
              window.opener.alert(cardNumber + "로 " + ${totalPrice} + "원이 결제 완료되었습니다.");
              window.opener.resetPage();  // 결제 후 부모 페이지 초기화
              window.close();
            } else {
              alert("신용카드 번호를 입력하세요.");  // 결제창에서 경고 메시지 표시
            }
          });
        </script>
      </body>
    </html>
  `);
});
