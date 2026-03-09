import java.util.*;

// ══════════════════════════════════════════════════════
//  LSMS E-Commerce — CO2: Shopping Cart
//  Demonstrates: Singly + Doubly Linked List
//  Real use: Cart — add items, remove items, view bag
// ══════════════════════════════════════════════════════

// ── Cart Item Node (Doubly Linked) ─────────────────────
class CartNode {
    int productId;
    String name;
    double price;
    int qty;
    CartNode prev, next;

    CartNode(int id, String name, double price, int qty) {
        this.productId = id;
        this.name  = name;
        this.price = price;
        this.qty   = qty;
        this.prev  = this.next = null;
    }
}

// ── Shopping Cart (Doubly Linked List) ─────────────────
class ShoppingCart {
    private CartNode head, tail;
    private int size;

    ShoppingCart() { head = tail = null; size = 0; }

    // Add item to cart (insert at tail — O(1))
    void addItem(int id, String name, double price, int qty) {
        // Check if already in cart → increment qty
        CartNode cur = head;
        while (cur != null) {
            if (cur.productId == id) {
                cur.qty += qty;
                System.out.println("  ✓ Updated qty for \"" + name + "\" → " + cur.qty + " units");
                return;
            }
            cur = cur.next;
        }
        CartNode node = new CartNode(id, name, price, qty);
        if (tail == null) {
            head = tail = node;
        } else {
            node.prev = tail;
            tail.next = node;
            tail = node;
        }
        size++;
        System.out.println("  ✓ Added \"" + name + "\" to cart");
    }

    // Remove item from cart by product ID — O(n)
    void removeItem(int id) {
        CartNode cur = head;
        while (cur != null) {
            if (cur.productId == id) {
                if (cur.prev != null) cur.prev.next = cur.next;
                else head = cur.next;
                if (cur.next != null) cur.next.prev = cur.prev;
                else tail = cur.prev;
                size--;
                System.out.println("  ✗ Removed \"" + cur.name + "\" from cart");
                return;
            }
            cur = cur.next;
        }
        System.out.println("  Product ID " + id + " not found in cart.");
    }

    // View cart (traverse forward — O(n))
    void viewCart() {
        if (head == null) { System.out.println("  Cart is empty."); return; }
        System.out.println("\n  ┌─────────────────────────────────────────────┐");
        System.out.println("  │              YOUR BAG                       │");
        System.out.println("  ├──────┬──────────────────────┬───────┬───────┤");
        System.out.printf("  │ %-4s │ %-20s │ %-5s │ %-5s │%n", "ID", "Product", "Price", "Qty");
        System.out.println("  ├──────┼──────────────────────┼───────┼───────┤");
        CartNode cur = head;
        double total = 0;
        while (cur != null) {
            System.out.printf("  │ %-4d │ %-20s │ $%-4.2f │ %-5d │%n",
                cur.productId, cur.name, cur.price, cur.qty);
            total += cur.price * cur.qty;
            cur = cur.next;
        }
        System.out.println("  ├──────┴──────────────────────┴───────┴───────┤");
        System.out.printf("  │  Total: $%-35.2f │%n", total);
        System.out.println("  └─────────────────────────────────────────────┘");
        System.out.println("  Items in cart: " + size);
    }

    // View cart in reverse (doubly linked — traverse backward)
    void viewReverse() {
        if (tail == null) { System.out.println("  Cart is empty."); return; }
        System.out.println("\n  Cart (reverse order — last added first):");
        CartNode cur = tail;
        while (cur != null) {
            System.out.printf("  ← %-20s $%.2f%n", cur.name, cur.price);
            cur = cur.prev;
        }
    }

    boolean isEmpty() { return size == 0; }
    int getSize() { return size; }
}

public class Cart {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ShoppingCart cart = new ShoppingCart();

        System.out.println("╔══════════════════════════════════════╗");
        System.out.println("║     LSMS — Shopping Cart (LL)        ║");
        System.out.println("╚══════════════════════════════════════╝");

        while (true) {
            System.out.println("\n  ==== CART MENU ====");
            System.out.println("  1. Add item to cart");
            System.out.println("  2. Remove item from cart");
            System.out.println("  3. View cart");
            System.out.println("  4. View cart in reverse");
            System.out.println("  0. Proceed to checkout (exit)");
            System.out.print("  Enter choice: ");
            int ch = sc.nextInt(); sc.nextLine();

            switch (ch) {
                case 1:
                    System.out.print("  Product ID: "); int id = sc.nextInt();
                    sc.nextLine();
                    System.out.print("  Product name: "); String name = sc.nextLine();
                    System.out.print("  Price: $"); double price = sc.nextDouble();
                    System.out.print("  Quantity: "); int qty = sc.nextInt();
                    cart.addItem(id, name, price, qty);
                    break;
                case 2:
                    System.out.print("  Enter Product ID to remove: ");
                    cart.removeItem(sc.nextInt());
                    break;
                case 3:
                    cart.viewCart();
                    break;
                case 4:
                    cart.viewReverse();
                    break;
                case 0:
                    if (cart.isEmpty()) System.out.println("  Cart is empty. Add items first!");
                    else { System.out.println("  ✓ Proceeding to checkout with " + cart.getSize() + " item(s)..."); }
                    sc.close(); return;
                default:
                    System.out.println("  Invalid choice.");
            }
        }
    }
}
