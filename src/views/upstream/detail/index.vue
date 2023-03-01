<template>
  <div class="container">
    <a-card class="general-card" :title="readonly ? '上游详情' : '创建上游'">
      <div class="wrapper">
        <a-form
          ref="formRef"
          :model="formData"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          class="form"
          @submit-success="submitSuccess"
        >
          <a-form-item
            label="上游名称"
            field="upstreamName"
            :rules="[
              {
                required: !readonly,
                message: '上游名称不能为空',
              },
            ]"
          >
            <a-input v-model="formData.upstreamName" :disabled="readonly" />
          </a-form-item>
          <a-form-item
            label="上游类型"
            field="upstreamType"
            :rules="[
              {
                required: !readonly,
                message: '上游类型不能为空',
              },
            ]"
          >
            <a-select
              v-model="formData.upstreamType"
              :options="upstreamTypeOptions"
              :disabled="readonly"
            />
          </a-form-item>
          <a-form-item
            v-if="formData.upstreamType === '0'"
            label="直连地址"
            field="httpAddress"
          >
            <a-input v-model="formData.httpAddress" :disabled="readonly" />
          </a-form-item>
          <a-form-item
            v-if="formData.upstreamType !== '0'"
            label="注册中心类型"
            field="discoveryType"
          >
            <a-select
              v-model="formData.discoveryType"
              :options="discoveryTypeOptions"
              :disabled="readonly"
            />
          </a-form-item>

          <a-form-item v-if="!readonly" class="actions">
            <a-space>
              <a-button type="primary" :loading="loading" html-type="submit">
                提交
              </a-button>
              <a-button> 重置 </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import {
    UpstreamRecord,
    createUpstream,
    queryUpstreamDetail,
    updateUpstream,
  } from '@/api/biz/upstream';
  import { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { Message } from '@arco-design/web-vue';
  import { useRoute, useRouter } from 'vue-router';

  const router = useRouter();
  const route = useRoute();
  const action = ref<string | string[]>('');
  const readonly = ref<boolean>(true);
  const formData = ref<UpstreamRecord>({ upstreamType: '0' } as UpstreamRecord);
  const formRef = ref<FormInstance>();
  const { loading, setLoading } = useLoading();

  const upstreamTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: 'HTTP直连',
      value: '0',
    },
    {
      label: 'SpringCloud',
      value: '1',
    },
    {
      label: 'Dubbo',
      value: '2',
    },
  ]);
  const discoveryTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: 'Nacos',
      value: '0',
    },
    {
      label: 'Eureka',
      value: '1',
    },
    {
      label: 'Zookeeper',
      value: '2',
    },
    {
      label: 'Etcd',
      value: '3',
    },
  ]);

  const submitSuccess = async () => {
    setLoading(true);
    try {
      if (action.value === '0') {
        const { msg } = await createUpstream(formData.value);
        await router.push({
          name: 'UpstreamList',
        });
        Message.info(msg);
      } else if (action.value === '2') {
        const { upstreamId } = route.params;
        formData.value.upstreamId = upstreamId as string;
        const { msg } = await updateUpstream(formData.value);
        await router.push({
          name: 'UpstreamList',
        });
        Message.info(msg);
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const init = async () => {
    const { upstreamId } = route.params;
    const { actionType } = route.query;
    action.value = actionType as string;
    readonly.value = (actionType as string) === '1';

    if (action.value === '1' || action.value === '2') {
      setLoading(true);
      try {
        const { data } = await queryUpstreamDetail({
          upstreamId,
        } as UpstreamRecord);
        formData.value = data;
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
    padding: 20px;
    overflow: hidden;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    //align-items: center;
    background-color: var(--color-bg-2);
  }

  .form {
    width: 580px;
    margin-top: 20px;
  }

  .actions {
    margin-top: 20px;
  }
</style>
