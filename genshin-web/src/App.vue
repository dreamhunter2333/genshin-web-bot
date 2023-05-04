<script setup>
import { NGrid, NGi, NInput, NButton, NSpace, NCard, NSpin, NInputNumber, NFormItem } from 'naive-ui'
import { onMounted, ref } from "vue";
import MarkdownIt from 'markdown-it';

const API_BASE = import.meta.env.VITE_API_BASE || "";
const md = new MarkdownIt();

const uid = ref(null);
const command = ref(null);
const result = ref("");
const loading = ref(false);


const onSubmit = async () => {
  try {
    loading.value = true;
    const response = await fetch(`${API_BASE}/api/genshin`, {
      method: "POST",
      body: JSON.stringify({
        uid: uid.value,
        command: command.value || "#帮助",
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${await response.text()}` || "请求失败");
    }
    let res = await response.json();
    result.value = md.render(res["text"]);
  } catch (error) {
    console.error(error);
    result.value = error.message || "请求失败";
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  (window.adsbygoogle = window.adsbygoogle || []).push({});
  (window.adsbygoogle = window.adsbygoogle || []).push({});
});
</script>

<template>
  <n-grid x-gap="12" :cols="6">
    <n-gi>
      <div class="side">
        <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8486711392183862" data-ad-slot="9515796661"
          data-ad-format="auto" data-full-width-responsive="true"></ins>
      </div>
    </n-gi>
    <n-gi span="4">
      <n-spin :show="loading">
        <div class="main">
          <n-space vertical>
            <h1>原</h1>
            <h4>本项目仅供娱乐，请先发送 "#绑定uid"</h4>
            <div style="display: inline-block;">
              <n-form-item label="UID" label-placement="left">
                <n-input-number v-model:value="uid" :min="100000000" :max="900000000" placeholder="请输入UID" />
              </n-form-item>
              <n-form-item label="指令" label-placement="left">
                <n-input v-model:value="command" type="textarea" placeholder="#帮助" />
              </n-form-item>
            </div>
            <div class="button-container">
              <n-button class="center" @click="onSubmit" tertiary round type="primary">
                发送
              </n-button>
            </div>
            <n-card title="结果">
              <div class="result" v-html="result"></div>
            </n-card>
          </n-space>
        </div>
      </n-spin>
    </n-gi>
    <n-gi>
      <div class="side">
        <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8486711392183862" data-ad-slot="3072024858"
          data-ad-format="auto" data-full-width-responsive="true"></ins>
      </div>
    </n-gi>
  </n-grid>
</template>

<style scoped>
.side {
  height: 100vh;
}

.main {
  height: 100vh;
  text-align: center;
}

.n-grid {
  height: 100%;
}

.n-gi {
  height: 100%;
}

.n-space {
  height: 100%;
}

.button-container {
  display: flex;
  justify-content: center;
}

.n-button {
  margin-top: 12px;
  text-align: center;
  margin-bottom: 12px;
}

.result {
  text-align: left;
}
</style>
