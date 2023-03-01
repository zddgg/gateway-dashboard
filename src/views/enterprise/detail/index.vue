<template>
  <div class="container">
    <a-card class="general-card" :title="readonly ? '企业详情' : '创建企业'">
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
            label="企业名称"
            field="enterpriseName"
            :rules="[
              {
                required: !readonly,
                message: '企业名称不能为空',
              },
            ]"
          >
            <a-input v-model="formData.enterpriseName" :disabled="readonly" />
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
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    createEnterprise,
    EnterpriseRecord,
    queryEnterpriseDetail,
    updateEnterprise,
  } from '@/api/biz/enterprise';

  const router = useRouter();
  const route = useRoute();
  const action = ref<string | string[]>('');
  const readonly = ref<boolean>(true);
  const formData = ref<EnterpriseRecord>({} as EnterpriseRecord);
  const formRef = ref<FormInstance>();
  const { loading, setLoading } = useLoading();

  const submitSuccess = async () => {
    setLoading(true);
    try {
      if (action.value === '0') {
        const { msg } = await createEnterprise(formData.value);
        await router.push({
          name: 'EnterpriseList',
        });
        Message.info(msg);
      } else if (action.value === '2') {
        const { enterpriseId } = route.params;
        formData.value.enterpriseId = enterpriseId as string;
        const { msg } = await updateEnterprise(formData.value);
        await router.push({
          name: 'EnterpriseList',
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
    const { enterpriseId } = route.params;
    const { actionType } = route.query;
    action.value = actionType as string;
    readonly.value = (actionType as string) === '1';

    if (action.value === '1' || action.value === '2') {
      setLoading(true);
      try {
        const { data } = await queryEnterpriseDetail({
          enterpriseId,
        } as EnterpriseRecord);
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
