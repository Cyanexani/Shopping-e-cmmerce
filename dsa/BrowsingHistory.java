import java.util.*;

// ══════════════════════════════════════════════════════
//  LSMS E-Commerce — CO3: Browsing History
//  Demonstrates: Stack (Array + Linked List)
//  Real use: Back button, recently viewed products
// ══════════════════════════════════════════════════════

// ── Page Node for Linked List Stack ────────────────────
class PageNode {
    String url, title;
    PageNode next;
    PageNode(String url, String title) {
        this.url = url; this.title = title; this.next = null;
    }
}

// ── Browser History Stack (Linked List) ────────────────
class BrowsingHistoryStack {
    private PageNode top;
    private int size;

    BrowsingHistoryStack() { top = null; size = 0; }

    // Push — visit a new page O(1)
    void visit(String url, String title) {
        PageNode node = new PageNode(url, title);
        node.next = top;
        top = node;
        size++;
        System.out.println("  ▶ Visited: [" + title + "] " + url);
    }

    // Pop — go back O(1)
    String goBack() {
        if (top == null) {
            System.out.println("  ✗ No page to go back to.");
            return null;
        }
        PageNode popped = top;
        top = top.next;
        size--;
        System.out.println("  ← Back to: [" + (top != null ? top.title : "Home") + "]");
        return popped.url;
    }

    // Peek — current page O(1)
    void currentPage() {
        if (top == null) System.out.println("  Currently on: Home");
        else System.out.println("  Currently on: [" + top.title + "] " + top.url);
    }

    // Display full history
    void showHistory() {
        if (top == null) { System.out.println("  No browsing history."); return; }
        System.out.println("\n  ── Browsing History (most recent first) ──");
        PageNode cur = top;
        int i = 1;
        while (cur != null) {
            System.out.printf("  %d. %-25s %s%n", i++, cur.title, cur.url);
            cur = cur.next;
        }
        System.out.println("  Total pages visited: " + size);
    }

    boolean isEmpty() { return top == null; }
}

// ── Recently Viewed Products Stack (Array) ─────────────
class RecentlyViewedStack {
    private static final int MAX = 5; // show last 5 viewed
    private String[] products = new String[MAX];
    private int top = -1;

    void view(String productName) {
        if (top == MAX - 1) {
            // Shift left to make room (drop oldest)
            for (int i = 0; i < MAX - 1; i++) products[i] = products[i + 1];
            top = MAX - 2;
        }
        products[++top] = productName;
    }

    void showRecent() {
        System.out.println("\n  ── Recently Viewed Products ──");
        if (top == -1) { System.out.println("  None yet."); return; }
        for (int i = top; i >= 0; i--) {
            System.out.println("  " + (top - i + 1) + ". " + products[i]);
        }
    }
}

public class BrowsingHistory {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        BrowsingHistoryStack history = new BrowsingHistoryStack();
        RecentlyViewedStack recent   = new RecentlyViewedStack();

        System.out.println("╔══════════════════════════════════════╗");
        System.out.println("║  LSMS — Browsing History (Stack)     ║");
        System.out.println("╚══════════════════════════════════════╝");

        // Pre-seed some navigation
        System.out.println("\n  Simulating user browsing session...");
        history.visit("index.html",              "LSMS Home");
        history.visit("smartphones.html",        "Smartphones");
        history.visit("product.html?id=1",       "Apple iPhone 15 Pro");
        recent.view("Apple iPhone 15 Pro");
        history.visit("product.html?id=3",       "MacBook Pro M3");
        recent.view("MacBook Pro M3");
        history.visit("cart.html",               "Your Bag");

        while (true) {
            System.out.println("\n  ==== BROWSER MENU ====");
            System.out.println("  1. Visit a page");
            System.out.println("  2. Go back");
            System.out.println("  3. Current page");
            System.out.println("  4. Show full history");
            System.out.println("  5. Show recently viewed products");
            System.out.println("  0. Exit");
            System.out.print("  Choice: ");
            int ch = sc.nextInt(); sc.nextLine();

            switch (ch) {
                case 1:
                    System.out.print("  URL: "); String url = sc.nextLine();
                    System.out.print("  Page title: "); String title = sc.nextLine();
                    history.visit(url, title);
                    if (url.startsWith("product")) {
                        System.out.print("  Product name (for recent): "); 
                        recent.view(sc.nextLine());
                    }
                    break;
                case 2: history.goBack(); break;
                case 3: history.currentPage(); break;
                case 4: history.showHistory(); break;
                case 5: recent.showRecent(); break;
                case 0: sc.close(); return;
                default: System.out.println("  Invalid choice.");
            }
        }
    }
}
