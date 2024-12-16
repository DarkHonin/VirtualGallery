insert into storage.buckets
  (id, name, public)
values
  ('uploads', 'uploads', TRUE);


CREATE POLICY "Give users SELECT access to own folder" ON storage.objects FOR SELECT TO public USING (bucket_id = 'uploads');

CREATE POLICY "Give users INSERT access to own folder" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'uploads' AND (select auth.uid()::text) = (storage.foldername(name))[1]);

CREATE POLICY "Give users UPDATE access to own folder" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'uploads' AND (select auth.uid()::text) = (storage.foldername(name))[1]);

CREATE POLICY "Give users DELETE access to own folder" ON storage.objects FOR DELETE TO public USING (bucket_id = 'uploads' AND (select auth.uid()::text) = (storage.foldername(name))[1]);