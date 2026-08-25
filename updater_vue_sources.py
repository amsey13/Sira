import codecs

with codecs.open('src/components/FriseMecquoise.vue', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add the CSS styles for sources-pane if we want. Actually, we'll just reuse .text-content or create .sources-list.
source_css = """
/* -------- AMÉLIORATION DES SOURCES -------- */
.sources-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.sources-list li {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  color: #e4e4e7;
  font-size: 1.05rem;
  line-height: 1.6;
  background: rgba(0, 0, 0, 0.4);
  padding: 15px 20px;
  border-radius: 8px;
  border-left: 4px solid #10b981;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.source-icon {
  color: #10b981;
  font-size: 1.2rem;
  margin-top: 5px;
  flex-shrink: 0;
}
"""
if ".sources-list {" not in text:
    text = text.replace("/* -------- AMÉLIORATION DU TEXTE (LE LECTEUR HISTORIQUE) -------- */", source_css + "\n/* -------- AMÉLIORATION DU TEXTE (LE LECTEUR HISTORIQUE) -------- */")


# 2. Add the button in chapter-tabs
tab_btn = """
                  <button
                    v-if="activeEvent.sources"
                    :class="{ active: activeTab === 'sources' }"
                    @click="activeTab = 'sources'"
                  >
                    SOURCES
                  </button>
"""
if "activeTab === 'sources'" not in text:
    text = text.replace("</button>\n                </div>", "</button>\n" + tab_btn + "                </div>")

# 3. Add the pane in the content area
pane_html = """
                  <div v-else-if="activeTab === 'sources'" class="tab-pane sources-pane" key="sources">
                    <ul class="sources-list">
                      <li v-for="(source, i) in activeEvent.sources" :key="i">
                        <i class="pi pi-verified source-icon"></i>
                        <span v-html="source"></span>
                      </li>
                    </ul>
                  </div>
"""
if "activeTab === 'sources'" not in pane_html or pane_html.strip() not in text:
    # insert before versets-pane
    text = text.replace("""                  <div
                    v-else-if="activeTab === 'versets'\"""", pane_html.strip() + "\n\n                  <div\n                    v-else-if=\"activeTab === 'versets'\"")

with codecs.open('src/components/FriseMecquoise.vue', 'w', encoding='utf-8') as f:
    f.write(text)

print("Vue component updated.")
