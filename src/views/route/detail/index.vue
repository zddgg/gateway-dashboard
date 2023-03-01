<template>
  <div class="container">
    <a-form
      ref="formRef"
      layout="vertical"
      :model="routeFormData"
      @submit-success="submitSuccess"
    >
      <a-space direction="vertical" :size="16">
        <a-card
          class="general-card"
          :title="readonly ? '路由详情' : '创建路由'"
        >
          <a-grid :cols="3" :col-gap="80">
            <a-grid-item>
              <a-form-item
                label="路由名称"
                field="routeName"
                :rules="[
                  {
                    required: !readonly,
                    message: '路由名称不能为空',
                  },
                ]"
              >
                <a-input
                  v-model="routeFormData.routeName"
                  :disabled="readonly"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item
                label="路由路径"
                field="routePath"
                :rules="[
                  {
                    required: !readonly,
                    message: '路由路径不能为空',
                  },
                ]"
              >
                <a-input
                  v-model="routeFormData.routePath"
                  :disabled="readonly"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item
                label="路由版本"
                field="routeVersion"
                :rules="[
                  {
                    required: !readonly,
                    message: '路由版本不能为空',
                  },
                ]"
              >
                <a-input
                  v-model="routeFormData.routeVersion"
                  :disabled="readonly"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item
                label="上游编号"
                field="upstreamId"
                :rules="[
                  {
                    required: !readonly,
                    message: '请选择上游信息',
                  },
                ]"
              >
                <a-input
                  v-if="routeFormData.upstreamId"
                  v-model="routeFormData.upstreamId"
                  disabled
                />
                <a-button
                  v-if="!readonly"
                  type="primary"
                  style="margin-left: 8px"
                  @click="visible = !visible"
                  >选择上游</a-button
                >
              </a-form-item>
            </a-grid-item>
          </a-grid>
        </a-card>
        <a-card class="general-card" title="上游信息">
          <a-grid :cols="3" :col-gap="80">
            <a-grid-item>
              <a-form-item label="上游编号" field="enterpriseId">
                <a-input v-model="upstreamFormData.upstreamId" disabled />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item label="上游名称" field="enterpriseName">
                <a-input v-model="upstreamFormData.upstreamName" disabled />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item label="HTTP地址" field="httpAddress">
                <a-input v-model="upstreamFormData.httpAddress" disabled />
              </a-form-item>
            </a-grid-item>
          </a-grid>
        </a-card>
      </a-space>
      <div v-if="!readonly" class="actions">
        <a-space>
          <a-button type="primary" :loading="loading" html-type="submit">
            提交
          </a-button>
          <a-button> 重置 </a-button>
        </a-space>
      </div>
    </a-form>
    <a-modal
      v-model:visible="visible"
      title="上游信息"
      unmount-on-close
      width="auto"
      :body-style="{ padding: 0, minWidth: '1080px' }"
      @ok="modalOk"
      @cancel="modalCancel"
    >
      <UpstreamList ref="upstreamListRef" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    createRoute,
    queryRouteDetail,
    RouteRecord,
    updateRoute,
  } from '@/api/biz/route';
  import UpstreamList from '@/views/upstream/components/list/index.vue';
  import { queryUpstreamDetail, UpstreamRecord } from '@/api/biz/upstream';

  const router = useRouter();
  const route = useRoute();
  const action = ref<string | string[]>('');
  const readonly = ref<boolean>(true);
  const routeFormData = ref<RouteRecord>({} as RouteRecord);
  const upstreamFormData = ref<UpstreamRecord>({} as UpstreamRecord);
  const formRef = ref<FormInstance>();
  const { loading, setLoading } = useLoading();
  const visible = ref(false);
  const upstreamListRef = ref({
    selectedKeysHandler: () => [],
  });

  const submitSuccess = async () => {
    setLoading(true);
    try {
      if (action.value === '0') {
        const { msg } = await createRoute(routeFormData.value);
        await router.push({
          name: 'RouteList',
        });
        Message.info(msg);
      } else if (action.value === '2') {
        const { routeId } = route.params;
        routeFormData.value.routeId = routeId as string;
        const { msg } = await updateRoute(routeFormData.value);
        await router.push({
          name: 'RouteList',
        });
        Message.info(msg);
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const modalCancel = () => {
    visible.value = false;
  };

  const queryUpstream = async (upstreamId: string) => {
    if (upstreamId) {
      const { data } = await queryUpstreamDetail({
        upstreamId,
      } as UpstreamRecord);
      upstreamFormData.value = data;
    }
  };

  const modalOk = () => {
    const keys = upstreamListRef.value.selectedKeysHandler();
    const upstreamId = keys[0] as string;
    queryUpstream(upstreamId);
    routeFormData.value.upstreamId = upstreamId;
    modalCancel();
  };

  const init = async () => {
    const { routeId } = route.params;
    const { actionType } = route.query;
    action.value = actionType as string;
    readonly.value = (actionType as string) === '1';

    if (action.value === '1' || action.value === '2') {
      setLoading(true);
      try {
        const { data } = await queryRouteDetail({
          routeId,
        } as RouteRecord);
        routeFormData.value = data;
        await queryUpstream(data.upstreamId);
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    }
  };

  init();
</script>

<style scoped lang="less">
  .container {
    padding: 20px 20px 40px;
    overflow: hidden;
  }

  .actions {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 60px;
    padding: 14px 20px 14px 0;
    text-align: right;
    background: var(--color-bg-2);
  }
</style>
