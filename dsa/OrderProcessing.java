import java.util.*;

// ══════════════════════════════════════════════════════
//  LSMS E-Commerce — CO3: Order Processing Queue
//  Demonstrates: Linear Queue, Circular Queue, LL Queue
//  Real use: Order placement → warehouse → dispatch flow
// ══════════════════════════════════════════════════════

// ── Order ──────────────────────────────────────────────
class Order {
    int orderId;
    String customerName;
    String product;
    double amount;
    String status;

    Order(int id, String customer, String product, double amount) {
        this.orderId      = id;
        this.customerName = customer;
        this.product      = product;
        this.amount       = amount;
        this.status       = "PENDING";
    }

    public String toString() {
        return String.format("Order#%-4d | %-12s | %-25s | $%-7.2f | %s",
            orderId, customerName, product, amount, status);
    }
}

// ── Linked List Queue (main order queue) ───────────────
class OrderQueueNode {
    Order order;
    OrderQueueNode next;
    OrderQueueNode(Order o) { this.order = o; this.next = null; }
}

class OrderQueue {
    private OrderQueueNode front, rear;
    private int size;
    private int processedCount = 0;

    OrderQueue() { front = rear = null; size = 0; }

    // Enqueue — new order placed O(1)
    void placeOrder(Order o) {
        OrderQueueNode node = new OrderQueueNode(o);
        if (rear == null) { front = rear = node; }
        else { rear.next = node; rear = node; }
        size++;
        System.out.println("  ✓ Order placed: " + o);
    }

    // Dequeue — process next order O(1)
    Order processNext() {
        if (front == null) {
            System.out.println("  ✗ No orders to process.");
            return null;
        }
        Order o = front.order;
        o.status = "DISPATCHED";
        front = front.next;
        if (front == null) rear = null;
        size--;
        processedCount++;
        System.out.println("  ✓ Processed: " + o);
        return o;
    }

    // Peek — next order to process
    void peekNext() {
        if (front == null) System.out.println("  Queue is empty.");
        else System.out.println("  Next: " + front.order);
    }

    // Display all pending orders
    void displayQueue() {
        if (front == null) { System.out.println("  No pending orders."); return; }
        System.out.println("\n  ── Pending Orders ──────────────────────────────────────");
        OrderQueueNode cur = front;
        int pos = 1;
        while (cur != null) {
            System.out.println("  " + pos++ + ". " + cur.order);
            cur = cur.next;
        }
        System.out.println("  Pending: " + size + " | Processed: " + processedCount);
    }

    boolean isEmpty() { return size == 0; }
    int size() { return size; }
}

// ── Circular Queue (for warehouse slots) ───────────────
class WarehouseSlotQueue {
    private int[] slots;
    private int front, rear, size, capacity;

    WarehouseSlotQueue(int capacity) {
        this.capacity = capacity;
        slots = new int[capacity];
        front = rear = -1; size = 0;
    }

    void assignSlot(int orderId) {
        if (size == capacity) { System.out.println("  Warehouse full! Cannot assign slot."); return; }
        rear = (rear + 1) % capacity;
        slots[rear] = orderId;
        if (front == -1) front = 0;
        size++;
        System.out.println("  ✓ Warehouse slot assigned to Order#" + orderId);
    }

    int releaseSlot() {
        if (front == -1) { System.out.println("  No slots in use."); return -1; }
        int id = slots[front];
        if (front == rear) { front = rear = -1; }
        else front = (front + 1) % capacity;
        size--;
        return id;
    }

    void displaySlots() {
        System.out.println("\n  ── Warehouse Slots (Circular Queue, capacity=" + capacity + ") ──");
        if (size == 0) { System.out.println("  All slots free."); return; }
        int cur = front;
        for (int i = 0; i < size; i++) {
            System.out.println("  Slot " + cur + " → Order#" + slots[cur]);
            cur = (cur + 1) % capacity;
        }
    }
}

public class OrderProcessing {
    static int nextOrderId = 1001;

    public static void main(String[] args) {
        Scanner sc   = new Scanner(System.in);
        OrderQueue orders    = new OrderQueue();
        WarehouseSlotQueue warehouse = new WarehouseSlotQueue(5);

        System.out.println("╔══════════════════════════════════════╗");
        System.out.println("║  LSMS — Order Processing (Queue)     ║");
        System.out.println("╚══════════════════════════════════════╝");

        // Pre-seed orders
        System.out.println("\n  Loading sample orders...");
        orders.placeOrder(new Order(nextOrderId++, "Aniketh",  "iPhone 15 Pro",     999.99));
        orders.placeOrder(new Order(nextOrderId++, "Srihitha", "Zara Floral Dress",  59.99));
        orders.placeOrder(new Order(nextOrderId++, "Ravi",     "MacBook Pro M3",   1999.99));
        warehouse.assignSlot(1001);
        warehouse.assignSlot(1002);

        while (true) {
            System.out.println("\n  ==== ORDER QUEUE MENU ====");
            System.out.println("  1. Place new order");
            System.out.println("  2. Process next order");
            System.out.println("  3. View pending orders");
            System.out.println("  4. Peek next order");
            System.out.println("  5. View warehouse slots");
            System.out.println("  0. Exit");
            System.out.print("  Choice: ");
            int ch = sc.nextInt(); sc.nextLine();

            switch (ch) {
                case 1:
                    System.out.print("  Customer name: "); String cust = sc.nextLine();
                    System.out.print("  Product: "); String prod = sc.nextLine();
                    System.out.print("  Amount: $"); double amt = sc.nextDouble();
                    Order o = new Order(nextOrderId++, cust, prod, amt);
                    orders.placeOrder(o);
                    warehouse.assignSlot(o.orderId);
                    break;
                case 2:
                    Order processed = orders.processNext();
                    if (processed != null) warehouse.releaseSlot();
                    break;
                case 3: orders.displayQueue(); break;
                case 4: orders.peekNext(); break;
                case 5: warehouse.displaySlots(); break;
                case 0: sc.close(); return;
                default: System.out.println("  Invalid choice.");
            }
        }
    }
}
