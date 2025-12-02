import supabase from '../supabase/supabase.client';

export class TodosService {
  async getTodos() {
    const { data, error } = await supabase.from('todos').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async addTodo(task: string, user_id: string) {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ task, status: 'Not Started', user_id }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}
