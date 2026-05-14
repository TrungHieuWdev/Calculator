/* 
   MÁYFM TÍNH - CALCULATOR LOGIC
   JavaScript Code với logic sạch, không thừa không thiếu
*/

const calculator = {
    /*
     * PHẦN DỮ LIỆU - DATA PROPERTIES
     * 
     * previousValue: Giá trị được lưu từ phép toán trước
     * currentValue: Giá trị được nhập hiện tại
     * operation: Toán tử được chọn (+, -, ×, ÷)
     * shouldResetDisplay: Flag để xác định có nên xóa display khi nhập số mới
     */
    previousValue: 0,
    currentValue: '0',
    operation: null,
    shouldResetDisplay: false,

    /*
     * GỌI CÁC PHẦN TỬ DOM
     * Lưu trữ các thẻ HTML để sử dụng liên tục
     */
    elements: {
        expressionDisplay: document.getElementById('expressionDisplay'),
        resultDisplay: document.getElementById('resultDisplay'),
        clearBtn: document.getElementById('clearBtn'),
        deleteBtn: document.getElementById('deleteBtn'),
        equalsBtn: document.getElementById('equalsBtn'),
        numberBtns: document.querySelectorAll('.btn-number'),
        operatorBtns: document.querySelectorAll('.btn-operator'),
        squareBtn: document.getElementById('squareBtn'),
        sqrtBtn: document.getElementById('sqrtBtn'),
        percentBtn: document.getElementById('percentBtn'),
        toggleSignBtn: document.getElementById('toggleSignBtn'),
    },

    /*
     * PHƯƠNG THỨC: KHỞI TẠO
     * 
     * Chức năng: Gắn các event listener cho các nút
     * Giải thích: Khi người dùng click nút, sẽ gọi hàm tương ứng
     */
    init() {
        // Gắn sự kiện click cho các nút số
        this.elements.numberBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleNumber(btn.dataset.number));
        });

        // Gắn sự kiện click cho các nút toán tử
        this.elements.operatorBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleOperator(btn.dataset.operator));
        });

        // Gắn sự kiện cho các nút chức năng
        this.elements.clearBtn.addEventListener('click', () => this.clear());
        this.elements.deleteBtn.addEventListener('click', () => this.delete());
        this.elements.equalsBtn.addEventListener('click', () => this.calculate());
        this.elements.squareBtn.addEventListener('click', () => this.square());
        this.elements.sqrtBtn.addEventListener('click', () => this.squareRoot());
        this.elements.percentBtn.addEventListener('click', () => this.percent());
        this.elements.toggleSignBtn.addEventListener('click', () => this.toggleSign());

        // Gắn sự kiện keyboard (cho phép nhập từ bàn phím)
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Cập nhật hiển thị ban đầu
        this.updateDisplay();
    },

    /*
     * PHƯƠNG THỨC: XỬ LÝ NHẬP SỐ
     * 
     * @param {string} number - Số được nhập (0-9 hoặc dấu chấm)
     * 
     * Logic:
     * 1. Nếu cần reset display, xóa giá trị cũ
     * 2. Nếu giá trị hiện tại là '0', thay thế (không thêm '0' trước)
     * 3. Ngăn chặn nhập nhiều dấu chấm (chỉ cho phép 1)
     * 4. Cập nhật display
     */
    handleNumber(number) {
        // Nếu flag shouldResetDisplay = true, bắt đầu mới
        if (this.shouldResetDisplay) {
            this.currentValue = '0';
            this.shouldResetDisplay = false;
        }

        // Xử lý dấu chấm (dấu thập phân)
        if (number === '.') {
            // Nếu đã có dấu chấm trong currentValue, không cho thêm
            if (this.currentValue.includes('.')) return;

            // Thêm dấu chấm vào currentValue
            this.currentValue += number;
        } else {
            // Xử lý số bình thường (0-9)
            // Nếu currentValue = '0', thay thế bằng số mới (không thêm)
            if (this.currentValue === '0') {
                this.currentValue = number;
            } else {
                // Nếu không phải '0', thêm số vào
                this.currentValue += number;
            }
        }

        // Cập nhật hiển thị
        this.updateDisplay();
    },

    /*
     * PHƯƠNG THỨC: XỬ LÝ TOÁN TỬ
     *  @param {string} operator - Toán tử được chọn (+, -, ×, ÷)
     * Logic:
     * 1. Nếu đã có phép toán chưa hoàn thành, tính nó trước
     * 2. Lưu giá trị hiện tại
     * 3. Ghi nhận toán tử
     * 4. Set flag để xóa display khi nhập số tiếp theo
     */
    handleOperator(operator) {
        // Chuyển đổi operator để hiển thị (÷ thay vì /, × thay vì *)
        const displayOperator = operator === '÷' ? '/' : operator === '×' ? '*' : operator;

        // Nếu đã có phép toán chưa hoàn thành, tính nó trước
        if (this.operation !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        // Lưu giá trị hiện tại thành previousValue
        this.previousValue = parseFloat(this.currentValue);

        // Ghi nhận toán tử
        this.operation = displayOperator;

        // Set flag để xóa display khi nhập số tiếp theo
        this.shouldResetDisplay = true;

        // Cập nhật hiển thị (biểu thức)
        this.updateDisplay();
    },

    /*
     * PHƯƠNG THỨC: TÍNH TOÁN KẾT QUẢ
     * 
     * Logic:
     * 1. Kiểm tra xem có phép toán nào chưa được thực hiện không
     * 2. Lấy giá trị hiện tại
     * 3. Thực hiện phép toán dựa trên operator
     * 4. Lưu kết quả vào currentValue
     * 5. Xóa thông tin phép toán
     * 6. Set flag để xóa display khi nhập tiếp
     */
    calculate() {
        // Nếu không có phép toán nào, không làm gì
        if (this.operation === null) return;

        // Lấy giá trị hiện tại
        const current = parseFloat(this.currentValue);

        // Biến để lưu kết quả
        let result;

        /**
         * SWITCH CASE: Kiểm tra toán tử và thực hiện phép toán tương ứng
         * 
         * +  : Cộng
         * -  : Trừ
         * *  : Nhân
         * /  : Chia (kiểm tra chia cho 0)
         */
        switch (this.operation) {
            case '+':
                result = this.previousValue + current;
                break;

            case '-':
                result = this.previousValue - current;
                break;

            case '*':
                result = this.previousValue * current;
                break;

            case '/':
                // Kiểm tra chia cho 0 (lỗi tinh vi #1)
                if (current === 0) {
                    alert('Không thể chia cho 0!');
                    this.clear();
                    return;
                }
                result = this.previousValue / current;
                break;

            default:
                return; // Toán tử không hợp lệ
        }

        // Làm tròn kết quả để tránh lỗi floating-point
        // Ví dụ: 0.1 + 0.2 = 0.30000000000000004
        // Giải pháp: làm tròn đến 10 chữ số thập phân
        result = Math.round(result * 10000000000) / 10000000000;

        // Chuyển kết quả thành chuỗi và lưu
        this.currentValue = result.toString();

        // Xóa thông tin phép toán
        this.operation = null;

        // Set flag để xóa display khi nhập số tiếp theo
        this.shouldResetDisplay = true;

        // Cập nhật hiển thị
        this.updateDisplay();
    },

    /*
     * PHƯƠNG THỨC: XÓA TẤT CẢ (AC - All Clear)
     * 
     * Logic: Đặt lại tất cả giá trị về trạng thái ban đầu
     */
    clear() {
        this.previousValue = 0;
        this.currentValue = '0';
        this.operation = null;
        this.shouldResetDisplay = false;

        this.updateDisplay();
    },

    /*
     * PHƯƠNG THỨC: XÓA 1 KÝ TỰ (DEL - Delete)
     * 
     * Logic:
     * 1. Nếu currentValue chỉ có 1 ký tự, đặt lại thành '0'
     * 2. Nếu không, xóa ký tự cuối cùng
     */
    delete() {
        // Nếu chỉ có 1 ký tự, đặt lại thành '0'
        if (this.currentValue.length === 1) {
            this.currentValue = '0';
        } else {
            // Xóa ký tự cuối (dùng slice để cắt từ 0 đến -1)
            this.currentValue = this.currentValue.slice(0, -1);
        }

        this.updateDisplay();
    },

    /*
     * PHƯƠNG THỨC: BÌNH PHƯƠNG (x²)
     * 
     * Logic: Lấy giá trị hiện tại, nhân với chính nó
     */
    square() {
        const current = parseFloat(this.currentValue);
        this.currentValue = (current * current).toString();
        this.shouldResetDisplay = true;

        this.updateDisplay();
    },

    /*
     * PHƯƠNG THỨC: CĂN BẬC HAI (√)
     * 
     * Logic:
     * 1. Kiểm tra số âm (không thể lấy căn bậc hai của số âm)
     * 2. Tính căn bậc hai
     * 3. Làm tròn đến 10 chữ số thập phân
     */
    squareRoot() {
        const current = parseFloat(this.currentValue);

        // Lỗi tinh vi #2: Kiểm tra số âm
        if (current < 0) {
            alert('Không thể lấy căn bậc hai của số âm!');
            return;
        }

        // Tính căn bậc hai
        const result = Math.sqrt(current);

        // Làm tròn để tránh lỗi floating-point
        this.currentValue = (Math.round(result * 10000000000) / 10000000000).toString();
        this.shouldResetDisplay = true;

        this.updateDisplay();
    },

    /*
     * PHƯƠNG THỨC: PHẦN TRĂM (%)
     * 
     * Logic: Chia giá trị hiện tại cho 100
     */
    percent() {
        const current = parseFloat(this.currentValue);
        this.currentValue = (current / 100).toString();
        this.shouldResetDisplay = true;

        this.updateDisplay();
    },

    /*
     * PHƯƠNG THỨC: ĐẢO DẤU (+/−)
     * 
     * Logic: Nhân giá trị hiện tại với -1 (đổi dấu)
     */
    toggleSign() {
        const current = parseFloat(this.currentValue);
        this.currentValue = (current * -1).toString();

        this.updateDisplay();
    },
    /*
     * PHƯƠNG THỨC: XỬ LÝ PHÍM BÀN PHÍM
     * 
     * @param {KeyboardEvent} event - Sự kiện từ bàn phím
     * 
     * Logic: Cho phép nhập từ bàn phím (0-9, +, -, *, /, Enter, Backspace, etc)
     */
    handleKeyboard(event) {
        // Nếu ấn 0-9
        if (event.key >= '0' && event.key <= '9') {
            this.handleNumber(event.key);
        }
        // Nếu ấn dấu chấm
        else if (event.key === '.') {
            this.handleNumber('.');
        }
        // Nếu ấn +
        else if (event.key === '+') {
            this.handleOperator('+');
        }
        // Nếu ấn -
        else if (event.key === '-') {
            this.handleOperator('-');
        }
        // Nếu ấn * (nhân)
        else if (event.key === '*') {
            this.handleOperator('×');
        }
        // Nếu ấn / (chia)
        else if (event.key === '/') {
            event.preventDefault(); // Ngăn chặn hành động mặc định
            this.handleOperator('÷');
        }
        // Nếu ấn Enter hoặc = (tính toán)
        else if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            this.calculate();
        }
        // Nếu ấn Backspace (xóa)
        else if (event.key === 'Backspace') {
            event.preventDefault();
            this.delete();
        }
        // Nếu ấn Escape (xóa tất cả)
        else if (event.key === 'Escape') {
            this.clear();
        }
    },

    /*
     * PHƯƠNG THỨC: CẬP NHẬT HIỂN THỊ
     * 
     * Logic:
     * 1. Cập nhật dòng biểu thức (previousValue + operator)
     * 2. Cập nhật dòng kết quả (currentValue)
     */
    updateDisplay() {
        // Hiển thị kết quả hiện tại
        this.elements.resultDisplay.textContent = this.currentValue;

        // Hiển thị biểu thức (previousValue + operator)
        let expressionText = '';
        if (this.operation !== null) {
            expressionText = `${this.previousValue} ${this.operation}`;
        }
        this.elements.expressionDisplay.textContent = expressionText;
    },
};
// 2. KHỞI ĐỘNG CHƯƠNG TRÌNH
/*
 * Khi DOM được load xong, gọi hàm init()
 * để gắn các event listener và chuẩn bị máy tính
 */
document.addEventListener('DOMContentLoaded', () => {
    calculator.init();
});