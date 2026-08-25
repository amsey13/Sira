import codecs
import re

with codecs.open('src/components/FriseMecquoise.vue', 'r', encoding='utf-8') as f:
    text = f.read()

source_css = """
/* -------- ONGLET SOURCES -------- */
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
</style>
"""
if ".sources-list {" not in text:
    text = text.replace("</style>", source_css)


tab_btn = """                  <button
                    v-if="activeEvent.sources"
                    :class="{ active: activeTab === 'sources' }"
                    @click="activeTab = 'sources'"
                  >
                    SOURCES
                  </button>
"""
if "activeTab === 'sources'" not in text:
    text = re.sub(r'(<button\s*v-if="activeEvent\.versets".*?</button>)', rf'{tab_btn}\1', text, flags=re.DOTALL)

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
if "class=\"tab-pane sources-pane\"" not in text:
    text = re.sub(r'(<div\s*v-else-if="activeTab === \'versets\'")', rf'{pane_html}\1', text, flags=re.DOTALL)


with codecs.open('src/components/FriseMecquoise.vue', 'w', encoding='utf-8') as f:
    f.write(text)

print("Vue component updated.")