# SKILL: WordPress Plugin

## Purpose

Build a well-structured, maintainable WordPress plugin following Shaun's conventions:
hooks at the edge, classes in the middle, admin UX on top, custom tables underneath.

## When to Use

- Building a new WordPress plugin from scratch
- Adding a major new module to an existing plugin
- Reviewing a WordPress plugin for structure and convention compliance

## Inputs Required

- [ ] Plugin name and purpose (from PRD.md)
- [ ] Does it need custom DB tables, or does it use WP post/meta?
- [ ] Does it add an admin page?
- [ ] Does it need a front-end shortcode, widget, or REST endpoint?
- [ ] Does it connect to any external API?
- [ ] WordPress minimum version and PHP minimum version

---

## Plugin Structure

Always use this folder layout. One class per file. Named consistently.

```
/plugin-name/
├── plugin-name.php              ← plugin header, constants, bootstrap loader
├── readme.txt                   ← WordPress.org format readme
├── changelog.txt                ← version history
│
├── /assets/
│   ├── /css/
│   │   ├── admin.css
│   │   └── public.css
│   └── /js/
│       ├── admin.js
│       └── public.js
│
├── /includes/
│   ├── class-plugin.php         ← main class: loads all modules, registers hooks
│   ├── class-activator.php      ← runs on plugin activation (create tables, set defaults)
│   └── class-deactivator.php    ← runs on deactivation (cleanup, flush rules)
│
├── /admin/
│   ├── class-admin.php          ← registers admin menus, enqueues admin assets
│   └── /views/                  ← PHP template files for admin pages
│       ├── page-settings.php
│       ├── page-dashboard.php
│       └── page-logs.php
│
├── /frontend/
│   └── class-frontend.php       ← registers shortcodes, enqueues public assets
│
├── /database/
│   ├── class-installer.php      ← CREATE TABLE statements, version-checked migrations
│   └── class-repository.php     ← ALL database queries live here, nowhere else
│
├── /services/
│   ├── class-[name]-service.php ← business logic and orchestration
│   └── class-export-service.php ← data export logic
│
├── /adapters/
│   └── class-[api]-adapter.php  ← one file per external API or service
│
├── /strategies/
│   └── class-[name]-strategy.php ← swappable logic (e.g. different event types)
│
└── /templates/
    └── [name].php               ← front-end output templates
```

---

## The Main Plugin File

`plugin-name.php` contains only:

```php
<?php
/**
 * Plugin Name: Plugin Name
 * Plugin URI:  https://example.com
 * Description: One-line description.
 * Version:     1.0.0
 * Author:      Shaun
 * License:     GPL-2.0+
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'PLUGIN_NAME_VERSION', '1.0.0' );
define( 'PLUGIN_NAME_PATH', plugin_dir_path( __FILE__ ) );
define( 'PLUGIN_NAME_URL', plugin_dir_url( __FILE__ ) );

require_once PLUGIN_NAME_PATH . 'includes/class-activator.php';
require_once PLUGIN_NAME_PATH . 'includes/class-deactivator.php';
require_once PLUGIN_NAME_PATH . 'includes/class-plugin.php';

register_activation_hook( __FILE__, array( 'Plugin_Name_Activator', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'Plugin_Name_Deactivator', 'deactivate' ) );

$plugin = new Plugin_Name();
$plugin->run();
```

---

## The Main Class (includes/class-plugin.php)

The main class does ONE thing: load modules and wire up hooks. No business logic here.

```php
<?php
class Plugin_Name {

    public function run() {
        $this->load_dependencies();
        $this->define_admin_hooks();
        $this->define_public_hooks();
    }

    private function load_dependencies() {
        require_once PLUGIN_NAME_PATH . 'database/class-installer.php';
        require_once PLUGIN_NAME_PATH . 'database/class-repository.php';
        require_once PLUGIN_NAME_PATH . 'services/class-tracking-service.php';
        require_once PLUGIN_NAME_PATH . 'admin/class-admin.php';
        require_once PLUGIN_NAME_PATH . 'frontend/class-frontend.php';
    }

    private function define_admin_hooks() {
        $admin = new Plugin_Name_Admin();
        add_action( 'admin_menu', array( $admin, 'add_menu_pages' ) );
        add_action( 'admin_enqueue_scripts', array( $admin, 'enqueue_assets' ) );
    }

    private function define_public_hooks() {
        $frontend = new Plugin_Name_Frontend();
        add_shortcode( 'plugin_name', array( $frontend, 'render_shortcode' ) );
        add_action( 'wp_enqueue_scripts', array( $frontend, 'enqueue_assets' ) );
    }
}
```

---

## Database Layer Rules

**class-installer.php** — creates tables on activation, runs version-checked upgrades:

```php
<?php
class Plugin_Name_Installer {

    public static function install() {
        global $wpdb;
        $table = $wpdb->prefix . 'plugin_name_events';
        $charset = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS $table (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            source VARCHAR(100) NOT NULL DEFAULT '',
            campaign VARCHAR(100) NOT NULL DEFAULT '',
            event_type VARCHAR(50) NOT NULL,
            payload LONGTEXT,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_source (source),
            KEY idx_created_at (created_at)
        ) $charset;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );

        update_option( 'plugin_name_db_version', PLUGIN_NAME_VERSION );
    }
}
```

**class-repository.php** — ALL SQL lives here. Business classes never touch `$wpdb`:

```php
<?php
class Plugin_Name_Repository {

    private $wpdb;
    private $table;

    public function __construct() {
        global $wpdb;
        $this->wpdb  = $wpdb;
        $this->table = $wpdb->prefix . 'plugin_name_events';
    }

    public function insert( array $data ): int {
        $this->wpdb->insert( $this->table, $data );
        return $this->wpdb->insert_id;
    }

    public function get_by_source( string $source ): array {
        return $this->wpdb->get_results(
            $this->wpdb->prepare(
                "SELECT * FROM {$this->table} WHERE source = %s ORDER BY created_at DESC",
                $source
            ),
            ARRAY_A
        );
    }
}
```

---

## Security Rules (mandatory)

| Rule | How |
|------|-----|
| Sanitise all input | `sanitize_text_field()`, `absint()`, `wp_kses_post()` on every `$_POST` value |
| Escape all output | `esc_html()`, `esc_attr()`, `esc_url()` on everything printed to screen |
| Nonces on all forms | `wp_nonce_field()` in form, `check_admin_referer()` before processing |
| Capability check | `current_user_can('manage_options')` before any admin action |
| No direct DB access | Use `$wpdb->prepare()` for all parameterised queries |
| No direct file access | `if ( ! defined( 'ABSPATH' ) ) exit;` at top of every PHP file |

---

## Admin Dashboard Pattern

Admin pages follow owner-mode-first / analyst-mode-second:

```php
<!-- views/page-dashboard.php -->
<div class="wrap plugin-name-dashboard">

    <!-- Owner Mode: KPI tiles -->
    <div class="plugin-name-kpi-row">
        <div class="plugin-name-tile">
            <span class="tile-number"><?php echo esc_html( $stats['today'] ); ?></span>
            <span class="tile-label">Today</span>
        </div>
        <div class="plugin-name-tile">
            <span class="tile-number"><?php echo esc_html( $stats['this_week'] ); ?></span>
            <span class="tile-label">This week</span>
        </div>
    </div>

    <!-- Analyst Mode: table + export -->
    <div class="plugin-name-table-wrap">
        <a href="<?php echo esc_url( $export_url ); ?>" class="button">Export CSV</a>
        <!-- table here -->
    </div>

</div>
```

---

## Adapter Pattern for External APIs

One class per external service. The service layer calls the adapter — never the raw API:

```php
<?php
class Plugin_Name_GA4_Adapter {

    private string $measurement_id;
    private string $api_secret;

    public function __construct( string $measurement_id, string $api_secret ) {
        $this->measurement_id = $measurement_id;
        $this->api_secret     = $api_secret;
    }

    public function send_event( string $event_name, array $params ): bool {
        $url = 'https://www.google-analytics.com/mp/collect'
             . '?measurement_id=' . $this->measurement_id
             . '&api_secret=' . $this->api_secret;

        $response = wp_remote_post( $url, array(
            'body'    => wp_json_encode( array(
                'events' => array( array( 'name' => $event_name, 'params' => $params ) ),
            ) ),
            'headers' => array( 'Content-Type' => 'application/json' ),
            'timeout' => 5,
        ) );

        return ! is_wp_error( $response );
    }
}
```

---

## Process

### Step 1 — Define the plugin identity
- Plugin name, slug, version
- Does it need DB tables? Admin page? Front-end output? REST endpoint?
- Any external APIs?

### Step 2 — Create the folder structure
Use the template above. Create placeholder files for every class.

### Step 3 — Write the installer
Create the DB tables with `dbDelta()`. Test: activate, check table exists.

### Step 4 — Write the repository
Every query in one place. No SQL elsewhere.

### Step 5 — Write the service(s)
Business logic only. No SQL, no HTML, no `$_POST` reading.

### Step 6 — Write the admin page(s)
Owner-mode KPI tiles first. Analyst table second. Export third.

### Step 7 — Wire hooks in the main class
`add_action` and `add_filter` only in `class-plugin.php`.

### Step 8 — Smoke test
Run the smoke test checklist from `SHAUN_PROJECT_CANVAS.md` section 9.

---

## Quality Check

- [ ] No SQL outside `/database/class-repository.php`
- [ ] No `echo` outside `/admin/views/` and `/templates/`
- [ ] No `$_POST` reading outside admin action handlers (with nonce check)
- [ ] Every form has a nonce field
- [ ] Every admin action checks `current_user_can()`
- [ ] Every output is escaped
- [ ] Every input is sanitised
- [ ] `ABSPATH` check at top of every PHP file
- [ ] Hooks only in `class-plugin.php`
- [ ] `ARCHITECTURE.md` reflects the actual folder structure
